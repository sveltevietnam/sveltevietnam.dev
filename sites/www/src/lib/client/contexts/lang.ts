import { getContext, setContext } from 'svelte';
import { derived, writable } from 'svelte/store';

const LANG_CONTEXT_ID = 'lang';

const commonT = {
	en: {
		sveltevienam: 'Svelte Vietnam',
	},
	vi: {
		sveltevienam: 'Svelte Việt Nam',
	},
};

export function setLangContext(initial: App.Language) {
	const lang = writable(initial);
	const t = derived(lang, ($lang) => ({
		common: commonT[$lang],
	}));
	return setContext(LANG_CONTEXT_ID, {
		lang,
		t,
	});
}

export function getLangContext() {
	return getContext<ReturnType<typeof setLangContext>>(LANG_CONTEXT_ID);
}
