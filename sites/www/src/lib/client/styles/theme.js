import { primitives, semantics } from './colors.js';

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
			grayscale: {
				...primitives.grayscale,
				light: {
					100: '#ffffff',
					200: '#E5E5E5',
					300: '#999999',
					400: '#4C4C4C',
				},
				dark: {
					100: '#1C1C1C',
					200: '#585757',
					300: '#969696',
					400: '#E8E8E8',
				},
			},
			primary: '#ef4623',
			svelte: '#ef4623',
			// FIXME temporary, refactor once there is a consistent color palette
			design: {
				grayscale: {
					light: {
						1: '#FFFFFF',
						2: '#EDECE8',
						3: '#DBDBDB',
					},
					dark: {
						1: '#000000',
						2: '#0D0D0D',
						3: '#201E1A',
						4: '#3F3F3F',
					},
				},
				neutral: {
					1: '#ACACAC',
					2: '#707070',
				},
			},
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
