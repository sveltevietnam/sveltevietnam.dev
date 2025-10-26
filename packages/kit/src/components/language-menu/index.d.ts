import type { Component } from 'svelte';
import type { HTMLDetailsAttributes } from 'svelte/elements';

import type { Language } from '../../constants';

/** assuming locales have been imported */
export interface LanguageMenuProps extends HTMLDetailsAttributes {
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
