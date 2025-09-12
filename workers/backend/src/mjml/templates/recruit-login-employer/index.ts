import { defineTemplate } from '..';
import { EMAILS } from '../constants';

import en from './en.mjml';
import vi from './vi.mjml';

export default defineTemplate((lang) => ({
	from: {
		email: EMAILS.NO_REPLY,
	},
	...(
		{
			en: {
				subject: 'Login — Recruit Platform from the Svelte Vietnam Community',
				html: en,
			},
			vi: {
				subject: 'Đăng nhập — Nền tảng Tuyển dụng từ Cộng đồng Svelte Việt Nam',
				html: vi,
			},
		} as const
	)[lang],
}));

export interface TemplateVars {
	name: string;
	callbackUrl: string;
}
