import type { Language } from '@sveltevietnam/i18n';
import type { Message } from '@sveltevietnam/i18n/runtime';
import type { Component } from 'svelte';
import type { HTMLDetailsAttributes } from 'svelte/elements';

export interface LanguageMenuProps extends HTMLDetailsAttributes {
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
	/** @default 'mobile' */
	showLabel?: 'always' | 'never' | 'mobile' | 'non-mobile';
	lang: Language;
	/** @bindable */
	open?: boolean;
}
/** Dropdown menu for switching global language. */
export const LanguageMenu: Component<LanguageMenuProps>;
