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
				subject: 'Your Job Posting is Now Live — Svelte Vietnam Community Recruit Platform',
				html: en,
			},
			vi: {
				subject: 'Đăng tuyển của bạn đã được duyệt — Nền tảng Tuyển dụng Cộng đồng Svelte Việt Nam',
				html: vi,
			},
		} as const
	)[lang],
}));

export interface RecruitEmployerCreateJobPostingApprovedVars {
	name: string;
	jobTitle: string;
	jobPublicUrl: string;
}
