import type { Component } from 'svelte';
import type { ClassValue, HTMLAttributes } from 'svelte/elements';

export interface JobPostingData {
	id: string;
	href?: string;
	title: string;
	type: string;
	location: string;
	salary: string;
	postedAt?: Date | null;
	expiredAt: Date;
	employer: {
		image?: string | null;
		name: string;
		website?: string | null;
	};
}

export interface JobPostingProps extends HTMLAttributes<HTMLElement> {
	posting: JobPostingData;
	containerClass?: ClassValue;
}

export interface JobPostingListProps extends HTMLAttributes<HTMLUListElement> {
	postings: JobPostingData[];
}

/** non-paginated list of job postings */
export const JobPostingList: Component<JobPostingListProps>;
export const JobPosting: Component<JobPostingProps>;
