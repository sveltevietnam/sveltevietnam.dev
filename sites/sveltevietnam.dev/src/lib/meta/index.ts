import type { Thing } from 'schema-dts';

export type PageMetadata = {
	title?: string;
	description?: string;
	keywords?: string;
	canonical?: string;
	structured?: Thing[] | Thing; // Structured Data LD+JSON
	og?: {
		title?: string;
		site_name?: string;
		description?: string;
		type?: 'website' | 'article' | 'profile';
		image?: string;
		imageAlt?: string;
		url?: string;
	};
	twitter?: {
		title?: string;
		description?: string;
		card?: string;
		image?: string;
		imageAlt?: string;
		site?: string;
		creator?: string;
	};
};
