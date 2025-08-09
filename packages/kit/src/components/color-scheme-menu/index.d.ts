import type { Message } from '@sveltevietnam/i18n/runtime';
import type { Component } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

import type { ColorScheme } from '../../constants';

export interface ColorSchemeMenuProps extends Omit<HTMLAttributes<HTMLElement>, 'onselect'> {
	i18n: {
		aria: Message<'string', never>;
		open: Message<'string', never>;
		light: Message<'string', never>;
		dark: Message<'string', never>;
		system: Message<'string', never>;
	};
	alwaysShowLabel?: boolean;
	hydrated?: boolean;
	colorScheme?: ColorScheme;
	/** @bindable */
	open?: boolean;
	onselect?: (scheme: ColorScheme) => void;
}
export const ColorSchemeMenu: Component<ColorSchemeMenuProps>;
