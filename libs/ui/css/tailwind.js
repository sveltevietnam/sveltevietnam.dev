import tailwindcssTypography from '@tailwindcss/typography';
import postcssColorScheme from 'postcss-color-scheme/lib/tailwind.js';
import plugin from 'tailwindcss/plugin';

import * as base from './base/base.dist.json';
import * as components from './components/components.dist.json';
import { theme } from './theme.js';
import * as utilities from './utilities/utilities.dist.json';

export const sveltevietnam = plugin(
	({ addBase, addVariant, addComponents, addUtilities }) => {
		// current variants
		for (const prefix of ['data', 'aria']) {
			addVariant(`${prefix}-current`, `&[${prefix}-current]:not([${prefix}-current="false"])`);
		}

		addBase(base);
		addComponents(components);
		addUtilities(utilities);
	},
	{
		darkMode: '',
		theme: {
			...theme,
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
		plugins: [postcssColorScheme, tailwindcssTypography],
	},
);
