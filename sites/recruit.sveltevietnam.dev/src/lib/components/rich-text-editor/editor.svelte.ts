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

export interface EditorBlockState {
	type:
		| 'paragraph'
		| 'h1'
		| 'h2'
		| 'h3'
		| 'h4'
		| 'h5'
		| 'h6'
		| 'list-bullet'
		| 'list-number'
		| 'quote';
}

export class Editor {
	public lexical: LexicalEditor;

	#subscribeToInline: ReturnType<typeof createSubscriber>;
	#inline: EditorInlineState = {
		format: {
			bold: false,
			italic: false,
			underline: false,
			code: false,
		},
		link: null,
	};

	#subscribeToBlock: ReturnType<typeof createSubscriber>;
	#block: EditorBlockState = {
		type: 'paragraph',
	};

	#subscribeToHtml: ReturnType<typeof createSubscriber>;
	#html: string = '';

	constructor(html?: string | null) {
		this.#html = html;
		this.lexical = createEditor({
			namespace: 'Test',
			nodes: [LinkNode, HeadingNode, QuoteNode, ListNode, ListItemNode],
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

		// subscribe to state change
		this.#subscribeToInline = createSubscriber((update) => {
			const off = this.lexical.registerUpdateListener(({ editorState }) => {
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
			});
			return off;
		});
		this.#subscribeToBlock = createSubscriber((update) => {
			const off = this.lexical.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					const selection = getSelection();
					// do some magic to get block type
					if (isRangeSelection(selection)) {
						const anchor = selection.anchor.getNode();
						const top = anchor.getTopLevelElement();
						if (top === null) return;
						if (isHeadingNode(top)) {
							this.#block.type = top.getTag().toLowerCase() as EditorBlockState['type'];
						} else if (isListNode(top)) {
							const parentList = getNearestNodeOfType<ListNode>(anchor, ListNode);
							let type = parentList ? parentList.getListType() : top.getListType();
							if (type === 'check') {
								// don't support check list for now
								type = 'bullet';
							}
							this.#block.type = `list-${type}` as EditorBlockState['type'];
						} else {
							this.#block.type = top.getType() as EditorBlockState['type'];
						}
						update();
					} else {
						// TODO: handle when isNodeSelection === true?
						this.#block.type = 'paragraph';
					}
				});
			});
			return off;
		});
		this.#subscribeToHtml = createSubscriber((update) => {
			const off = this.lexical.registerUpdateListener(
				debounce(({ editorState }) => {
					editorState.read(() => {
						this.#html = generateHtmlFromNodes(this.lexical);
						update();
					});
				}, 200),
			);
			return off;
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

				const unregisterHtmlListener = this.lexical.registerUpdateListener(
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
				);

				// registering plugins
				const unregisterPlugins = mergeRegister(
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
				);

				return () => {
					unregisterPlugins();
					unregisterHtmlListener();
				};
			},
		};
	}

	setSelectionBlockType(type: EditorBlockState['type']): void {
		if (type.startsWith('list')) {
			const listType = type.slice(5) as ListType;
			switch (listType) {
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

					case 'h1':
					case 'h2':
					case 'h3':
					case 'h4':
					case 'h5':
					case 'h6': {
						return createHeadingNode(type);
					}

					case 'paragraph':
					default:
						return createParagraphNode();
				}
			});
		});
	}

	get inline(): EditorInlineState {
		this.#subscribeToInline();
		return this.#inline;
	}

	get block(): EditorBlockState {
		this.#subscribeToBlock();
		return this.#block;
	}

	get html(): string {
		this.#subscribeToHtml();
		return this.#html;
	}
}
