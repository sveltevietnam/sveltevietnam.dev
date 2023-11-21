import tailwindcssTypography from '@tailwindcss/typography';
import postcssColorScheme from 'postcss-color-scheme/lib/tailwind.js';

import sveltevietnam from './src/lib/client/styles/postcss/tailwind.js';

/** @type {import("tailwindcss").Config } */
export default {
	theme: {
		extend: {
			typography: ({ theme }) => {
				return {
					DEFAULT: {
						css: {
							'--tw-prose-body': theme('colors.design.fg.1'),
							'--tw-prose-invert-body': theme('colors.design.fg.1'),
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
	darkMode: '',
	content: ['./src/**/*.{html,js,svelte,ts,md}', 'svelte.config.js'],
	plugins: [sveltevietnam, postcssColorScheme, tailwindcssTypography],
};
