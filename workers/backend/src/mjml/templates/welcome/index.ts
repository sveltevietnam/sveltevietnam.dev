import { defineTemplate } from '..';

import vi from './vi.mjml';
import en from './vi.mjml';

export default defineTemplate((lang) => ({
	...(
		{
			en: {
				subject: 'Welcome to Svelte Vietnam!',
				html: en,
			},
			vi: {
				subject: 'Chào mừng bạn đến với Svelte Việt Nam!',
				html: vi,
			},
		} as const
	)[lang],
}));

export interface TemplateVars {
	name: string;
}
