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
				subject: 'Complete your Registration — Svelte Vietnam Community Recruit Platform',
				html: en,
			},
			vi: {
				subject: 'Hoàn thiện quy trình đăng ký — Nền tảng Tuyển dụng Cộng đồng Svelte Việt Nam',
				html: vi,
			},
		} as const
	)[lang],
}));

export interface RecruitEmployerOnboardVars {
	callbackUrl: string;
}
