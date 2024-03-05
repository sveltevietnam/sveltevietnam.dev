import { primitives, semantics } from './colors.js';

/** @type {import('tailwindcss').Config['theme']} */
export const theme = {
	extend: {
		screens: {
			sp: {
				raw: '(width <= 768px)',
			},
			tb: {
				raw: '(width >= 768px)',
			},
			'tb-to-pc': {
				raw: '(768px <= width < 1024px)',
			},
			pc: {
				raw: '(width >= 1024px)',
			},
			'upto-pc': {
				raw: '(width < 1024px)',
			},
		},
		fontSize: {
			'2xs': '0.625rem',
		},
		fontFamily: {
			inter: ['Inter', 'sans-serif'],
			lora: ['Lora', 'serif'],
		},
		spacing: {
			header: 'var(--header-height, 0)',
			'w-pad': 'var(--pad-padding-x, 0)',
		},
		colors: {
			...primitives,
			...semantics,
			svelte: '#ef4623',
		},
		zIndex: {
			px: '1',
			header: '50', // root header
			modal: '80', // a modal/dialog
			// sidebar: '92', // sidebar
			// float: '100', // floating buttons and such
			popup: '120', // tooltip, dropdown, popover etc
			overlay: '150', // a full screen overlay
			// command: '200', // command palette
			notification: '300', // notification
		},
	},
};
