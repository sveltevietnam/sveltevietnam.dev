import tailwindcssTypography from '@tailwindcss/typography';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import postcssColorScheme from 'postcss-color-scheme/lib/tailwind.js';
import definePlugin from 'tailwindcss/plugin.js';

import base from './base/base.dist.json';
import components from './components/components.dist.json';
import { theme } from './theme.js';
import utilities from './utilities/utilities.dist.json';

/** @type {import('tailwindcss/types/config.js').PresetsConfig} */
export const core = {
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
