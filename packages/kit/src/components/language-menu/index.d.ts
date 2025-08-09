import type { Language } from '@sveltevietnam/i18n';
import type { Message } from '@sveltevietnam/i18n/runtime';
import type { Component } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface LanguageMenuProps extends HTMLAttributes<HTMLElement> {
	i18n: {
		aria: Message<'string', never>;
		open: Message<'string', never>;
		menu: Message<'string', never>;
		switchTo: Message<'string', never>;
		vietnamese: Message<'string', never>;
		english: Message<'string', never>;
	};
	routing: {
		vi: string;
		en: string;
	};
	alwaysShowLabel?: boolean;
	hydrated?: boolean;
	lang: Language;
	/** @bindable */
	open?: boolean;
}
export const LanguageMenu: Component<LanguageMenuProps>;
