export const JOB_POSTING_TYPES = [
	'full-time',
	'part-time',
	'internship',
	'contract',
	'volunteer',
] as const;
export type JobPostingType = (typeof JOB_POSTING_TYPES)[number];

export const JOB_POSTING_APPLICATION_METHODS = ['email', 'url'] as const;
export type JobPostingApplicationMethod = (typeof JOB_POSTING_APPLICATION_METHODS)[number];

export const JOB_POSTING_STATUSES = ['pending', 'active', 'expired', 'deleted'] as const;
export type JobPostingStatus = (typeof JOB_POSTING_STATUSES)[number];
