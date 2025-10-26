import { registerDragonSupport } from '@lexical/dragon';
import { namedSignals } from '@lexical/extension';
import { createEmptyHistoryState, registerHistory } from '@lexical/history';
import { $generateNodesFromDOM, $generateHtmlFromNodes } from '@lexical/html';
import { LinkNode, registerLink } from '@lexical/link';
import {
	$isListNode,
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
	$isHeadingNode,
	$createHeadingNode,
	$createQuoteNode,
} from '@lexical/rich-text';
import { $trimTextContentFromAnchor, $setBlocksType as setBlocksType } from '@lexical/selection';
import { $canShowPlaceholder, $canShowPlaceholderCurry } from '@lexical/text';
import {
	mergeRegister,
	$getNearestNodeOfType as getNearestNodeOfType,
	$restoreEditorState,
} from '@lexical/utils';
import type { Status, Language } from '@sveltevietnam/kit/constants';
import {
	createEditor,
	type LexicalEditor,
	$isRangeSelection,
	$getSelection,
	$createParagraphNode,
	$insertNodes,
	type UpdateListener,
	RootNode,
	type EditorState,
	$getRoot,
} from 'lexical';
import debounce from 'lodash.debounce';
import { createAttachmentKey } from 'svelte/attachments';
import type { HTMLAttributes } from 'svelte/elements';
import { createSubscriber } from 'svelte/reactivity';

import {
	$isCalloutNode,
	$createCalloutNode,
	CalloutNode,
	registerCallout,
} from './plugins/callout';
import { registerFloatingLinkEditor } from './plugins/floating-link-editor';
import { $isSelectingLink } from './utils/is-selecting-link';

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

export interface EditorInit {
	/** initial content as html to prefill on mount */
	html?: string | null;
	/** min & max heading levels to enable */
	headings?: [min: HeadingLevel, max: HeadingLevel];
	/** save and restore on init, */
	cache?:
		| string
		| {
				/** default to storage */
				area?: 'local' | 'session';
				/** storage key */
				key: string;
				/** default to 500ms */
				debounce?: number;
		  };
	maxLength?: number;
}

export class Editor {
	public lexical: LexicalEditor;
	public init: EditorInit;

	/// ========== (Lazy) reactive content length ==========
	get contentLength(): number {
		this.#subscribeToLength();
		return this.#contentLength;
	}
	#contentLength: number = 0;
	#subscribeToLength = createSubscriber((update) =>
		this.lexical.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				const root = $getRoot();
				const length = root.getTextContentSize();
				if (this.#contentLength !== length) {
					this.#contentLength = length;
					update();
				}
			});
		}),
	);

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
				const selection = $getSelection();
				this.#inline.link = $isSelectingLink();
				if ($isRangeSelection(selection)) {
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
				const selection = $getSelection();
				// do some magic to get block type
				if ($isRangeSelection(selection)) {
					const anchor = selection.anchor.getNode();
					const top = anchor.getTopLevelElement();
					if (top === null) return;
					if ($isHeadingNode(top)) {
						this.#block = {
							type: 'heading',
							props: {
								level: parseInt(top.getTag().slice(1), 10) as HeadingLevel,
							},
						};
					} else if ($isListNode(top)) {
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
					} else if ($isCalloutNode(top)) {
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
			debounce(
				(({ editorState }) => {
					editorState.read(() => {
						const empty = $canShowPlaceholder(this.lexical.isComposing());
						this.#html = empty ? '' : $generateHtmlFromNodes(this.lexical);
						update();
					});
				}) as UpdateListener,
				200,
			),
		),
	);

	/// ========== (Lazy) reactive placeholder state ==========
	get canShowPlaceholder(): boolean {
		this.#subscribeToCanShowPlaceholder();
		return this.#canShowPlaceholder;
	}
	#canShowPlaceholder: boolean = true;
	#subscribeToCanShowPlaceholder = createSubscriber((update) =>
		this.lexical.registerUpdateListener(({ editorState }) => {
			const canShowPlaceholder = editorState.read(
				$canShowPlaceholderCurry(this.lexical.isComposing()),
			);
			if (this.#canShowPlaceholder !== canShowPlaceholder) {
				this.#canShowPlaceholder = canShowPlaceholder;
				update();
			}
		}),
	);

	constructor(init: EditorInit = {}) {
		this.init = init;
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
				const cache = resolveCacheConfig(this.init.cache);

				if (this.init.html) {
					this.lexical.update(() => {
						const parser = new DOMParser();
						const dom = parser.parseFromString(this.init.html ?? '', 'text/html');
						const nodes = $generateNodesFromDOM(this.lexical, dom);
						$insertNodes(nodes);
					});
				} else if (cache) {
					const json = cache.area.getItem(cache.key);
					if (json) {
						try {
							const editorState = this.lexical.parseEditorState(json);
							this.lexical.setEditorState(editorState);
						} catch {
							cache.area.removeItem(cache.key);
						}
					}
				}

				const registrations = [
					this.lexical.registerUpdateListener(
						debounce(({ editorState }) => {
							editorState.read(() => {
								const empty = $canShowPlaceholder(this.lexical.isComposing());
								this.#html = empty ? '' : $generateHtmlFromNodes(this.lexical);
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
				];

				if (this.init.headings) {
					const [min, max] = this.init.headings;
					registrations.push(
						this.lexical.registerNodeTransform(HeadingNode, (node) => {
							const level = parseInt(node.getTag().slice(1));
							if (level < min) {
								node.setTag(`h${min}`);
							} else if (level > max) {
								node.setTag(`h${max}`);
							}
						}),
					);
				}

				if (cache) {
					registrations.push(
						this.lexical.registerUpdateListener(
							debounce(({ editorState }) => {
								cache.area.setItem(cache.key, JSON.stringify(editorState));
							}, cache.ms),
						),
					);
				}

				const maxLength = this.init.maxLength;
				if (maxLength) {
					// see: https://github.com/facebook/lexical/blob/486d1b92f7325360d234ce6354b95abfcd947c07/packages/lexical-playground/src/plugins/MaxLengthPlugin/index.tsx
					let lastRestoredEditorState: EditorState | null = null;
					registrations.push(
						this.lexical.registerNodeTransform(RootNode, (rootNode) => {
							const selection = $getSelection();
							if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
								return;
							}
							const prevEditorState = this.lexical.getEditorState();
							const prevTextContentSize = prevEditorState.read(() => rootNode.getTextContentSize());
							const textContentSize = rootNode.getTextContentSize();
							if (prevTextContentSize !== textContentSize) {
								const delCount = textContentSize - maxLength;
								const anchor = selection.anchor;

								if (delCount > 0) {
									// Restore the old editor state instead if the last
									// text content was already at the limit.
									if (
										prevTextContentSize === maxLength &&
										lastRestoredEditorState !== prevEditorState
									) {
										lastRestoredEditorState = prevEditorState;
										$restoreEditorState(this.lexical, prevEditorState);
									} else {
										$trimTextContentFromAnchor(this.lexical, anchor, delCount);
									}
								}
							}
						}),
					);
				}

				return mergeRegister(...registrations);
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
			const selection = $getSelection();
			setBlocksType(selection, () => {
				switch (type) {
					case 'quote':
						return $createQuoteNode();

					case 'heading': {
						return $createHeadingNode(`h${(props as HeadingBlockState['props']).level}`);
					}

					case 'callout':
						return $createCalloutNode((props as CalloutBlockState['props']).status);

					case 'paragraph':
					default:
						return $createParagraphNode();
				}
			});
		});
	}
}

function resolveCacheConfig(cache: EditorInit['cache']) {
	if (!cache) return null;
	let area = localStorage;
	let ms = 500;
	let key: string;
	if (typeof cache === 'string') {
		key = cache;
	} else {
		if (cache.area === 'session') {
			area = sessionStorage;
		}
		ms = cache.debounce ?? 500;
		key = cache.key;
	}

	return { area, ms, key };
}
