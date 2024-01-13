import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';

const LANG_CONTEXT_ID = 'lang';

export function setLangContext(initial: App.Language) {
	const lang = writable(initial);
	return setContext(LANG_CONTEXT_ID, lang);
}

export function getLangContext() {
	return getContext<ReturnType<typeof setLangContext>>(LANG_CONTEXT_ID);
}
