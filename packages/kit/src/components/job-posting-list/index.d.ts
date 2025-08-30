import type { Message } from '@sveltevietnam/i18n/runtime';
import type { Component } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface JobPosting {
	id: string;
	href: string;
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

export interface JobPostingListProps extends HTMLAttributes<HTMLUListElement> {
	postings: JobPosting[];
	i18n: {
		at: Message<'string', never>;
		postedAt: Message<'string', never>;
		expiredAt: Message<'string', never>;
	};
}

/** non-paginated list of job postings */
export const JobPostingList: Component<JobPostingListProps>;
