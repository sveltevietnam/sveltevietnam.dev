import tailwindcssTypography from '@tailwindcss/typography';
import postcssColorScheme from 'postcss-color-scheme/tailwind';
import definePlugin from 'tailwindcss/plugin.js';

import * as coreJss from './jss/core.js';
import * as typographyJss from './jss/typography.js';
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
			addBase(/** @type {any} */ (coreJss.base));
			addComponents(/** @type {any} */ (coreJss.components));
			addUtilities(coreJss.utilities);
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
							'--tw-prose-captions': theme('colors.fg.200'),
							pre: {
								'max-height': '80dvh',
							},
						},
					},
				};
			},
		},
	},
	plugins: [
		tailwindcssTypography,
		definePlugin(({ addBase }) => {
			addBase(/** @type {any} */ (typographyJss.base));
		}),
	],
};

/** @type {import('tailwindcss/types/config.js').PresetsConfig[]} */
export const presets = [core, typography];

export default presets;
