import tailwindcssTypography from '@tailwindcss/typography';
import postcssColorScheme from 'postcss-color-scheme/tailwind';
import definePlugin from 'tailwindcss/plugin.js';

import base from './jss/base.jss.json';
import components from './jss/components.jss.json';
import utilities from './jss/utilities.jss.json';
import { theme } from './theme.js';

/** @type {import('tailwindcss/types/config.js').PresetsConfig} */
export const core = {
	darkMode: /** @type {any} */ (''),
	theme,
	plugins: [
		postcssColorScheme,
		definePlugin(({ addBase, addVariant, addComponents, addUtilities }) => {
			// current variants
			for (const prefix of ['data', 'aria']) {
				addVariant(`${prefix}-current`, `&[${prefix}-current]:not([${prefix}-current="false"])`);
			}
			addBase(/** @type {any} */ (base));
			addComponents(/** @type {any} */ (components));
			addUtilities(utilities);
		}),
	],
};

/** @type {import('tailwindcss/types/config.js').PresetsConfig} */
export const typography = {
	darkMode: /** @type {any} */ (''),
	theme: {
		extend: {
			/** @param {{ theme: import('tailwindcss/types/config.js').PluginUtils['theme']}} param0 */
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

/** @type {import('tailwindcss/types/config.js').PresetsConfig[]} */
export const presets = [core, typography];

export default presets;
