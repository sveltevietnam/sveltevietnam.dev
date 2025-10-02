import { type Status } from '@sveltevietnam/kit/constants';
import {
	$getSelection,
	$isRangeSelection,
	$applyNodeReplacement,
	COMMAND_PRIORITY_LOW,
	createCommand,
	ParagraphNode,
	type EditorConfig,
	type LexicalCommand,
	type LexicalEditor,
	type LexicalUpdateJSON,
	type NodeKey,
	type SerializedParagraphNode,
	type DOMExportOutput,
	isHTMLElement,
	type DOMConversionMap,
} from 'lexical';

const CLASSES: Record<Status, string> = {
	info: 'c-callout--info',
	success: 'c-callout--success',
	warning: 'c-callout--warning',
	error: 'c-callout--error',
};

interface SerializedCalloutNode extends SerializedParagraphNode {
	status: Status;
}

export class CalloutNode extends ParagraphNode {
	public __status: Status;

	constructor(status?: Status, key?: NodeKey) {
		super(key);
		this.__status = status ?? 'info';
	}

	static getType() {
		return 'callout';
	}

	static clone(node: CalloutNode): CalloutNode {
		return new CalloutNode(node.__status, node.__key);
	}

	static importJSON(serializedNode: SerializedCalloutNode): CalloutNode {
		return new CalloutNode().updateFromJSON(serializedNode);
	}

	static importDOM(): DOMConversionMap | null {
		return {
			p: (node) => {
				if (node.classList.contains('c-callout')) {
					return {
						conversion: (domNode) => ({
							node: $createCalloutNode(
								domNode.classList.contains('c-callout--success')
									? 'success'
									: domNode.classList.contains('c-callout--warning')
										? 'warning'
										: domNode.classList.contains('c-callout--error')
											? 'error'
											: 'info',
							),
						}),
						priority: 3,
					};
				}
				return null;
			},
		};
	}

	getStatus(): Status {
		const self = this.getLatest();
		return self.__status;
	}

	setStatus(status: Status): this {
		const self = this.getWritable();
		self.__status = status;
		return self;
	}

	createDOM(config: EditorConfig): HTMLElement {
		const element = super.createDOM(config);
		element.classList.add('c-callout', CLASSES[this.getStatus()]);
		return element;
	}

	updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
		const isUpdated = super.updateDOM(prevNode, dom, config);
		if (prevNode.__status !== this.__status) {
			dom.classList.remove(CLASSES[prevNode.__status]);
			dom.classList.add(CLASSES[this.__status]);
		}
		return isUpdated;
	}

	updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedCalloutNode>): this {
		const self = super.updateFromJSON(serializedNode);
		return self.setStatus(serializedNode.status);
	}

	exportJSON(): SerializedCalloutNode {
		const serialized = super.exportJSON() as SerializedCalloutNode;
		serialized.status = this.getStatus();
		return serialized;
	}

	exportDOM(editor: LexicalEditor): DOMExportOutput {
		const exported = super.exportDOM(editor);
		if (isHTMLElement(exported.element)) {
			exported.element.classList.add('c-callout', CLASSES[this.getStatus()]);
		}
		return exported;
	}
}

export function $createCalloutNode(status?: Status): CalloutNode {
	return $applyNodeReplacement(new CalloutNode(status));
}

export function $isCalloutNode(node: unknown): node is CalloutNode {
	return node instanceof CalloutNode;
}

export const FORMAT_CALLOUT_COMMAND: LexicalCommand<{ status: Status }> = createCommand();

export function registerCallout(editor: LexicalEditor): () => void {
	return editor.registerCommand(
		FORMAT_CALLOUT_COMMAND,
		function (payload) {
			const selection = $getSelection();
			if (!$isRangeSelection(selection)) return false;
			const anchor = selection.anchor.getNode();
			const top = anchor.getTopLevelElement();
			if (!$isCalloutNode(top)) return false;
			top.setStatus(payload.status);
			return true;
		},
		COMMAND_PRIORITY_LOW,
	);
}

export { default as CalloutStatusDropdown } from './CalloutStatusDropdown.svelte';
