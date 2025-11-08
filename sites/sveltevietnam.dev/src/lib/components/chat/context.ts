import { getContext, setContext } from 'svelte';
import type { Picture } from 'vite-imagetools';

export interface ChatParticipant {
	id?: string;
	name?: string;
	avatar?: Picture | string;
	href?: string;
}
export type ChatDisplay = 'bubble' | 'box';
export interface ChatContext {
	display?: ChatDisplay;
}

const CHAT_CONTEXT_KEY = Symbol('chat');
export function getChatContext(): ChatContext {
	return getContext(CHAT_CONTEXT_KEY);
}
export function setChatContext(context: ChatContext): ChatContext {
	return setContext(CHAT_CONTEXT_KEY, context);
}
