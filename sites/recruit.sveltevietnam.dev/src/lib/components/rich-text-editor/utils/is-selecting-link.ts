/// Does not take into account auto link!

import { $isLinkNode as isLinkNode } from '@lexical/link';
import {
	$isRangeSelection as isRangeSelection,
	$isNodeSelection as isNodeSelection,
	$findMatchingParent as findMatchingParent,
	$isLineBreakNode as isLineBreakNode,
	$getSelection as getSelection,
} from 'lexical';

import { $getSelectedNode } from './get-selected-node';

export function $isSelectingLink(): string | null {
	const selection = getSelection();
	if (isRangeSelection(selection)) {
		const focusNode = $getSelectedNode(selection);
		const focusLinkNode = findMatchingParent(focusNode, isLinkNode);
		if (!focusLinkNode) {
			return null;
		}
		const badNode = selection
			.getNodes()
			.filter((node) => !isLineBreakNode(node))
			.find((node) => {
				const linkNode = findMatchingParent(node, isLinkNode);
				return (
					(focusLinkNode && !focusLinkNode.is(linkNode)) ||
					(linkNode && !linkNode.is(focusLinkNode))
				);
			});
		if (badNode) {
			return null;
		}
		if (isLinkNode(focusLinkNode)) {
			return focusLinkNode.getURL();
		}
		if (isLinkNode(focusNode)) {
			return focusNode.getURL();
		}
		return '';
	} else if (isNodeSelection(selection)) {
		const nodes = selection.getNodes();
		if (nodes.length === 0) {
			return null;
		}
		const node = nodes[0];
		const parent = node.getParent();
		if (isLinkNode(parent)) {
			return parent.getURL();
		} else if (isLinkNode(node)) {
			return node.getURL();
		}
		return '';
	}
	return null;
}
