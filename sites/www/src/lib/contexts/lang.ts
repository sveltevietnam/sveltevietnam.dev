import { getContext, setContext } from 'svelte';
import { derived, type Writable } from 'svelte/store';

const LANG_CONTEXT_ID = 'lang';

const commonT = {
	en: {
		sveltevienam: 'Svelte Vietnam',
		colorSchemes: {
			title: 'Color Scheme',
			dark: 'Dark',
			light: 'Light',
			system: 'System',
		},
		language: 'Language',
	},
	vi: {
		sveltevienam: 'Svelte Việt Nam',
		colorSchemes: {
			title: 'Chế độ hiển thị',
			dark: 'Tối',
			light: 'Sáng',
			system: 'Hệ thống',
		},
		language: 'Ngôn ngữ',
	},
};

export function setLangContext(lang: Writable<App.Language>) {
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
