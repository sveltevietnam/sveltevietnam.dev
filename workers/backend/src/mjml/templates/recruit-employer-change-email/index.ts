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
				subject: 'Verify your Email Change Request — Svelte Vietnam Community Recruit Platform',
				html: en,
			},
			vi: {
				subject: 'Xác nhận yêu cầu thay đổi email — Nền tảng Tuyển dụng Cộng đồng Svelte Việt Nam',
				html: vi,
			},
		} as const
	)[lang],
}));

export interface RecruitEmployerChangeEmailVars {
	name: string;
	newEmail: string;
	callbackUrl: string;
}
