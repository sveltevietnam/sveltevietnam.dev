import type { Message } from '@sveltevietnam/i18n/runtime';
import type { Component } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface JobPostingData {
	id: string;
	href?: string;
	title: string;
	type: string;
	location: string;
	salary: string;
	postedAt: Date;
	expiredAt: Date;
	employer: {
		avatarUrl?: string;
		name: string;
	};
}

export interface JobPostingI18N {
	at: Message<'string', never>;
	postedAt: Message<'string', never>;
	expiredAt: Message<'string', never>;
}

export interface JobPostingProps extends HTMLAttributes<HTMLElement> {
	posting: JobPostingData;
	i18n: JobPostingI18N;
}

export interface JobPostingListProps extends HTMLAttributes<HTMLUListElement> {
	postings: JobPostingData[];
	i18n: JobPostingI18N;
}

/** non-paginated list of job postings */
export const JobPostingList: Component<JobPostingListProps>;
export const JobPosting: Component<JobPostingProps>;
