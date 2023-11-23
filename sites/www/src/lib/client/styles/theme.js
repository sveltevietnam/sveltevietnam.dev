import { primitives, semantics } from './colors/index.js';

/** @type {import('tailwindcss').Config['theme']} */
export const theme = {
	extend: {
		screens: {
			sp: {
				// smart phone
				max: '767px',
			},
			'upto-tb': {
				max: '767px',
			},
			tb: {
				// tablet
				min: '768px',
			},
			'tb-to-pc': {
				min: '768px',
				max: '1023px',
			},
			pc: {
				// desktop
				min: '1024px',
			},
			'upto-pc': {
				max: '1023px',
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
			header: 'var(--header-height)',
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
