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
				subject: 'Job Posting Pending Approval  — Svelte Vietnam Community Recruit Platform',
				html: en,
			},
			vi: {
				subject: 'Đăng tuyển đang chờ xét duyệt — Nền tảng Tuyển dụng Cộng đồng Svelte Việt Nam',
				html: vi,
			},
		} as const
	)[lang],
}));

export interface RecruitAdminJobPostingPendingApprovalVars {
	employerName: string;
	jobTitle: string;
}
