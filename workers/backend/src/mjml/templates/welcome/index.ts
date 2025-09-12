import { defineTemplate } from '..';
import { EMAILS } from '../constants';

import en from './en.mjml';
import vi from './vi.mjml';

export default defineTemplate((lang) => ({
	from: {
		email: EMAILS.NEWSLETTER,
	},
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

export interface WelcomTemplateVars {
	eVerifyUrl: string;
	name: string;
}
