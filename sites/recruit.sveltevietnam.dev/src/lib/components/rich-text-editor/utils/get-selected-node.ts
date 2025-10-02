/// https://github.com/facebook/lexical/blob/e5d9556e40d5adca9d5c736321a1e403817015af/packages/lexical-playground/src/utils/getSelectedNode.ts
//
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { $isAtNodeEnd as isAtNodeEnd } from '@lexical/selection';
import { type ElementNode, type RangeSelection, type TextNode } from 'lexical';

export function getSelectedNode(selection: RangeSelection): TextNode | ElementNode {
	const anchor = selection.anchor;
	const focus = selection.focus;
	const anchorNode = selection.anchor.getNode();
	const focusNode = selection.focus.getNode();
	if (anchorNode === focusNode) {
		return anchorNode;
	}
	const isBackward = selection.isBackward();
	if (isBackward) {
		return isAtNodeEnd(focus) ? anchorNode : focusNode;
	} else {
		return isAtNodeEnd(anchor) ? anchorNode : focusNode;
	}
}
