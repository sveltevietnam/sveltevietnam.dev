export const ids = [
	'welcome',
	'recruit-employer-onboard',
	'recruit-employer-login',
	'recruit-employer-change-email',
	'recruit-employer-create-job-posting',
	'recruit-admin-job-posting-pending-approval',
] as const;

export type Id = (typeof ids)[number];
