import { $isLinkNode as isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { mergeRegister } from '@lexical/utils';
import type { Language } from '@sveltevietnam/kit/constants';
import {
	$getSelection,
	$isRangeSelection,
	$findMatchingParent,
	$isNodeSelection,
	CLICK_COMMAND,
	type LexicalEditor,
	COMMAND_PRIORITY_LOW,
	getDOMSelection,
	SELECTION_CHANGE_COMMAND,
	COMMAND_PRIORITY_CRITICAL,
} from 'lexical';
import { mount, unmount } from 'svelte';

import * as m from '$data/locales/generated/messages';

import { $getSelectedNode } from '../../utils/get-selected-node';
import { $isSelectingLink } from '../../utils/is-selecting-link';

import { default as FloatingLinkEditor } from './FloatingLinkEditor.svelte';

interface RegisterFloatingLinkEditorArgs {
	lexical: LexicalEditor;
	element: HTMLElement;
	lang: () => Language;
}

interface MountFloatingLinkEditorArgs {
	trigger: HTMLElement;
	editing?: boolean;
	initialValue?: string;
}

export function registerFloatingLinkEditor(config: RegisterFloatingLinkEditorArgs): () => void {
	const { lexical, element: editorElement, lang } = config;
	let floatingLinkEditorComponentInstace: ReturnType<typeof mount> | null = null;
	const lastTrigger: HTMLElement | null = null;

	function mountFloatingLinkEditor({
		trigger,
		editing,
		initialValue,
	}: MountFloatingLinkEditorArgs) {
		floatingLinkEditorComponentInstace = mount(FloatingLinkEditor, {
			target: editorElement ?? document.body,
			anchor: editorElement,
			context: new Map([['t:lang', lang]]),
			props: {
				trigger,
				editing,
				initialValue,
				i18n: {
					name: m['components.rich_text_editor.floating_link_editor.name'],
					discard: m['components.rich_text_editor.floating_link_editor.discard'],
					edit: m['components.rich_text_editor.floating_link_editor.edit'],
					remove: m['components.rich_text_editor.floating_link_editor.remove'],
					save: m['components.rich_text_editor.floating_link_editor.save'],
					placeholder: m['components.rich_text_editor.floating_link_editor.placeholder'],
				},
				onremoved: () => {
					if (initialValue) lexical.dispatchCommand(TOGGLE_LINK_COMMAND, null);
				},
				onsaved: (text) => {
					if (!text) {
						lexical.dispatchCommand(TOGGLE_LINK_COMMAND, null);
					} else {
						lexical.dispatchCommand(TOGGLE_LINK_COMMAND, text);
					}
				},
				ondiscard: (text) => {
					if (!text) unmountFloatingLinkEditor();
				},
			},
			intro: true,
		});
	}

	function unmountFloatingLinkEditor() {
		if (floatingLinkEditorComponentInstace) {
			unmount(floatingLinkEditorComponentInstace, { outro: true });
			floatingLinkEditorComponentInstace = null;
		}
	}

	function getTrigger(): HTMLElement | null {
		const selection = $getSelection();
		const nativeSelection = getDOMSelection(lexical._window);

		if (!selection) return null;
		if ($isNodeSelection(selection)) {
			const nodes = selection.getNodes();
			if (nodes.length > 0) {
				const element = lexical.getElementByKey(nodes[0].getKey());
				return element;
			}
		} else if (nativeSelection && editorElement.contains(nativeSelection.anchorNode)) {
			const element = nativeSelection.focusNode?.parentElement ?? null;
			return element;
		}

		return null;
	}

	mergeRegister(
		// when cmd/ctll+clik the link, open to new tab
		lexical.registerCommand(
			CLICK_COMMAND,
			(payload) => {
				const selection = $getSelection();
				if ($isRangeSelection(selection)) {
					const node = $getSelectedNode(selection);
					const linkNode = $findMatchingParent(node, isLinkNode);
					if (isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
						window.open(linkNode.getURL(), '_blank');
						return true;
					}
				}
				return false;
			},
			COMMAND_PRIORITY_LOW,
		),

		// when selection change to a link, show the floating editor
		lexical.registerCommand(
			SELECTION_CHANGE_COMMAND,
			() => {
				const link = $isSelectingLink();
				if (link === null) {
					unmountFloatingLinkEditor();
					return false;
				}

				const trigger = getTrigger();
				if (!trigger || (trigger === lastTrigger && floatingLinkEditorComponentInstace)) {
					return false;
				}

				unmountFloatingLinkEditor();
				mountFloatingLinkEditor({
					trigger,
					editing: link === '',
					initialValue: link,
				});
				return true;
			},
			COMMAND_PRIORITY_LOW,
		),

		// when removing link, unmount the floating editor
		lexical.registerCommand(
			TOGGLE_LINK_COMMAND,
			(payload) => {
				if (payload === null) {
					unmountFloatingLinkEditor();
				}
				return false;
			},
			COMMAND_PRIORITY_CRITICAL,
		),
	);

	return () => {
		unmountFloatingLinkEditor();
	};
}
