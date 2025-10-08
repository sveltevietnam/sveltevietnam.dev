import { type Status } from '@sveltevietnam/kit/constants';
import {
	$getSelection,
	$isRangeSelection,
	COMMAND_PRIORITY_LOW,
	createCommand,
	type LexicalCommand,
	type LexicalEditor,
} from 'lexical';

import { $isCalloutNode } from './node';

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
