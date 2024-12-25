import type { Thing, WithContext } from 'schema-dts';

export type PageMetadata = {
	title?: string;
	description?: string;
	keywords?: string[];
	canonical?: string;
	structured?: string; // Structured Data LD+JSON
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
	alternateLangs?: {
		lang: string;
		href: string;
	}[];
};

export type PageCrumb = {
	slug: string;
	label: string;
};

export function withContext<T extends Thing>(data: T) {
	return {
		'@context': 'https://schema.org',
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		...(data as any)
	} satisfies WithContext<T>;
}

export function toStringWithContext<T extends Thing>(data: T | T[]): string {
	if (Array.isArray(data)) {
		return JSON.stringify(data.map(withContext));
	}
	return JSON.stringify(withContext(data));
}

