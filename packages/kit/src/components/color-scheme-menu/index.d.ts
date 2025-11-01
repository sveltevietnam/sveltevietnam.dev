import type { Component } from 'svelte';
import type { HTMLDetailsAttributes } from 'svelte/elements';

import type { ColorScheme } from '@sveltevietnam/kit/constants';

export interface ColorSchemeMenuProps extends Omit<HTMLDetailsAttributes, 'onselect'> {
	/** @default 'mobile' */
	showLabel?: 'always' | 'never' | 'mobile' | 'non-mobile';
	colorScheme?: ColorScheme;
	/** @bindable */
	open?: boolean;
	onselect?: (scheme: ColorScheme) => void;
}

/** Dropdown menu for switching global color scheme. */
export const ColorSchemeMenu: Component<ColorSchemeMenuProps>;
