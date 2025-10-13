import { defineTemplate } from '..';
import { EMAILS } from '../constants';

import template from './template.mjml';

export default defineTemplate(() => ({
	from: {
		email: EMAILS.NO_REPLY,
	},
	subject: 'Job Posting Pending Approval  — Svelte Vietnam Community Recruit Platform',
	html: template,
}));

export interface RecruitAdminJobPostingPendingApprovalVars {
	posting: {
		title: string;
		type: string;
		location: string;
		salary: string;
		expiration: string;
		application: string;
		description: string;
	};
	employer: {
		name: string;
		email: string;
		website?: string | null;
		image?: string | null;
		description: string;
	};
	approveEndpoint: string;
}
