import tailwindcssTypography from '@tailwindcss/typography';
import postcssColorScheme from 'postcss-color-scheme/lib/tailwind.js';
import definePlugin from 'tailwindcss/plugin';

import * as base from './base/base.dist.json';
import * as components from './components/components.dist.json';
import { theme } from './theme.js';
import * as utilities from './utilities/utilities.dist.json';

/** @type {import('tailwindcss').Config} */
export const core = {
	darkMode: '',
	theme,
	plugins: [
		postcssColorScheme,
		definePlugin(({ addBase, addVariant, addComponents, addUtilities }) => {
			// current variants
			for (const prefix of ['data', 'aria']) {
				addVariant(`${prefix}-current`, `&[${prefix}-current]:not([${prefix}-current="false"])`);
			}

			addBase(base);
			addComponents(components);
			addUtilities(utilities);
		}),
	],
};

/** @type {import('tailwindcss').Config} */
export const typography = {
	darkMode: '',
	theme: {
		extend: {
			typography: ({ theme }) => {
				return {
					DEFAULT: {
						css: {
							'--tw-prose-body': theme('colors.fg.DEFAULT'),
							'--tw-prose-invert-body': theme('colors.fg.DEFAULT'),
							'--tw-prose-bold': 'inherit',
							'a:not(.heading-anchor)': {
								'@apply c-link': {},
								'text-decoration': 'none',
							},
						},
					},
				};
			},
		},
	},
	plugins: [tailwindcssTypography],
};

/** @type {Array<import('tailwindcss').Config>} */
export const presets = [core, typography];

export default presets;
