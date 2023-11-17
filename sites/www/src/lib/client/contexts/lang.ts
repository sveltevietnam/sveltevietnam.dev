import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';

import type { Language } from '$shared/services/i18n';

const LANG_CONTEXT_ID = 'lang';

export function setLangContext(initial: Language) {
	const lang = writable(initial);
	return setContext(LANG_CONTEXT_ID, lang);
}

export function getLangContext() {
	return getContext<ReturnType<typeof setLangContext>>(LANG_CONTEXT_ID);
}
