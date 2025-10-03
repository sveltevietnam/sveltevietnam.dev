import { registerDragonSupport } from '@lexical/dragon';
import { namedSignals } from '@lexical/extension';
import { createEmptyHistoryState, registerHistory } from '@lexical/history';
import {
	$generateNodesFromDOM as generateNodesFromDOM,
	$generateHtmlFromNodes as generateHtmlFromNodes,
} from '@lexical/html';
import { LinkNode, registerLink } from '@lexical/link';
import {
	$isListNode as isListNode,
	ListNode,
	registerList,
	ListItemNode,
	type ListType,
	INSERT_UNORDERED_LIST_COMMAND,
	INSERT_ORDERED_LIST_COMMAND,
} from '@lexical/list';
import {
	HeadingNode,
	QuoteNode,
	registerRichText,
	$isHeadingNode as isHeadingNode,
	$createHeadingNode as createHeadingNode,
	$createQuoteNode as createQuoteNode,
} from '@lexical/rich-text';
import { $setBlocksType as setBlocksType } from '@lexical/selection';
import { mergeRegister, $getNearestNodeOfType as getNearestNodeOfType } from '@lexical/utils';
import type { Language } from '@sveltevietnam/i18n';
import type { Status } from '@sveltevietnam/kit/constants';
import {
	createEditor,
	type LexicalEditor,
	$isRangeSelection as isRangeSelection,
	$getSelection as getSelection,
	$createParagraphNode as createParagraphNode,
	$insertNodes as insertNodes,
} from 'lexical';
import debounce from 'lodash.debounce';
import { createAttachmentKey } from 'svelte/attachments';
import type { HTMLAttributes } from 'svelte/elements';
import { createSubscriber } from 'svelte/reactivity';

import {
	$isCalloutNode as isCalloutNode,
	$createCalloutNode as createCalloutNode,
	CalloutNode,
	registerCallout,
} from './callout';
import { registerFloatingLinkEditor } from './floating-link-editor';
import { isSelectingLink } from './utils/is-selecting-link';

interface EditorInlineState {
	format: {
		bold: boolean;
		italic: boolean;
		underline: boolean;
		code: boolean;
	};
	link: string | null;
}

export type BlockState<Type, Props = undefined> = undefined extends Props
	? {
			type: Type;
		}
	: {
			type: Type;
			props: Props;
		};

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingBlockState = BlockState<'heading', { level: HeadingLevel }>;
export type ListBlockState = BlockState<'list', { listType: ListType }>;
export type ParagraphBlockState = BlockState<'paragraph'>;
export type QuoteBlockState = BlockState<'quote'>;
export type CalloutBlockState = BlockState<'callout', { status: Status }>;

export type BlockTypeToProps = {
	heading: HeadingBlockState['props'];
	list: ListBlockState['props'];
	paragraph: undefined;
	quote: undefined;
	callout: CalloutBlockState['props'];
};
export type BlockType = keyof BlockTypeToProps;

export type EditorBlockState =
	| HeadingBlockState
	| ListBlockState
	| ParagraphBlockState
	| QuoteBlockState
	| CalloutBlockState;

export class Editor {
	public lexical: LexicalEditor;

	/// ========== (Lazy) reactive inline state ==========
	get inline(): EditorInlineState {
		this.#subscribeToInline();
		return this.#inline;
	}
	#inline: EditorInlineState = {
		format: {
			bold: false,
			italic: false,
			underline: false,
			code: false,
		},
		link: null,
	};
	#subscribeToInline = createSubscriber((update) =>
		this.lexical.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				const selection = getSelection();
				this.#inline.link = isSelectingLink();
				if (isRangeSelection(selection)) {
					this.#inline.format.bold = selection.hasFormat('bold');
					this.#inline.format.italic = selection.hasFormat('italic');
					this.#inline.format.underline = selection.hasFormat('underline');
					this.#inline.format.code = selection.hasFormat('code');
				}
				update();
			});
		}),
	);

	/// ========== (Lazy) reactive block state ==========
	get block(): EditorBlockState {
		this.#subscribeToBlock();
		return this.#block;
	}
	#block: EditorBlockState = { type: 'paragraph' };
	#subscribeToBlock = createSubscriber((update) =>
		this.lexical.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				const selection = getSelection();
				// do some magic to get block type
				if (isRangeSelection(selection)) {
					const anchor = selection.anchor.getNode();
					const top = anchor.getTopLevelElement();
					if (top === null) return;
					if (isHeadingNode(top)) {
						this.#block = {
							type: 'heading',
							props: {
								level: parseInt(top.getTag().slice(1), 10) as HeadingLevel,
							},
						};
					} else if (isListNode(top)) {
						const parentList = getNearestNodeOfType<ListNode>(anchor, ListNode);
						let listType = parentList ? parentList.getListType() : top.getListType();
						if (listType === 'check') {
							// don't support check list for now
							listType = 'bullet';
						}
						this.#block = {
							type: 'list',
							props: {
								listType,
							},
						};
					} else if (isCalloutNode(top)) {
						this.#block = {
							type: 'callout',
							props: {
								status: top.getStatus() as Status,
							},
						};
					} else {
						this.#block = { type: top.getType() } as EditorBlockState;
					}
					update();
				} else {
					// TODO: handle when isNodeSelection === true?
					this.#block.type = 'paragraph';
				}
			});
		}),
	);

	/// ========== (Lazy) reactive output html ==========
	get html(): string {
		this.#subscribeToHtml();
		return this.#html;
	}
	#html: string = '';
	#subscribeToHtml = createSubscriber((update) =>
		this.lexical.registerUpdateListener(
			debounce(({ editorState }) => {
				editorState.read(() => {
					this.#html = generateHtmlFromNodes(this.lexical);
					update();
				});
			}, 200),
		),
	);

	constructor(html?: string | null) {
		this.#html = html ?? '';
		this.lexical = createEditor({
			namespace: 'Test',
			nodes: [LinkNode, HeadingNode, QuoteNode, ListNode, ListItemNode, CalloutNode],
			onError: (error: Error) => {
				throw error;
			},
			theme: {
				text: {
					bold: 'font-bold',
					italic: 'italic',
					underline: 'underline',
				},
				link: 'cursor-pointer',
			},
		});
	}

	attach(lang: () => Language): HTMLAttributes<HTMLElement> {
		return {
			[createAttachmentKey()]: (element) => {
				this.lexical.setRootElement(element);

				if (this.#html) {
					this.lexical.update(() => {
						const parser = new DOMParser();
						const dom = parser.parseFromString(this.#html, 'text/html');
						const nodes = generateNodesFromDOM(this.lexical, dom);
						insertNodes(nodes);
					});
				}

				return mergeRegister(
					this.lexical.registerUpdateListener(
						debounce(({ editorState }) => {
							editorState.read(() => {
								this.#html = generateHtmlFromNodes(this.lexical);
								element.dispatchEvent(
									new CustomEvent<{ html: string }>('changehtml', {
										detail: {
											html: this.#html,
										},
									}),
								);
							});
						}, 200),
					),
					registerRichText(this.lexical),
					registerDragonSupport(this.lexical),
					registerHistory(this.lexical, createEmptyHistoryState(), 300),
					registerList(this.lexical),
					registerLink(
						this.lexical,
						namedSignals({
							validateUrl: function (url) {
								try {
									if (!url) return true;
									// eslint-disable-next-line svelte/prefer-svelte-reactivity
									new URL(url);
									return true;
								} catch {
									return false;
								}
							},
							attributes: {
								target: '_blank',
								rel: 'noreferrer noopener external',
							},
						}),
					),
					registerFloatingLinkEditor({
						lexical: this.lexical,
						element,
						lang,
					}),
					registerCallout(this.lexical),
				);
			},
		};
	}

	setSelectionBlockType<T extends BlockType>(type: T, props: BlockTypeToProps[T]): void {
		if (type === 'list') {
			switch ((props as ListBlockState['props']).listType) {
				case 'number':
					this.lexical.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
					break;
				case 'bullet':
				default:
					this.lexical.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
			}
			return;
		}

		this.lexical.update(() => {
			const selection = getSelection();
			setBlocksType(selection, () => {
				switch (type) {
					case 'quote':
						return createQuoteNode();

					case 'heading': {
						return createHeadingNode(`h${(props as HeadingBlockState['props']).level}`);
					}

					case 'callout':
						return createCalloutNode((props as CalloutBlockState['props']).status);

					case 'paragraph':
					default:
						return createParagraphNode();
				}
			});
		});
	}
}
