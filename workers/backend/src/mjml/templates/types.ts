import type { Language } from '@sveltevietnam/i18n';

import type { ids } from './ids';

export interface BaseTemplateVars {
	subject: string;
	siteUrl: string;
	logoUrl: string;
	discordUrl: string;
	/** "View on web" link */
	mailUrl: string;
	/** "Manage subscription" link */
	socials: Record<
		string,
		{
			href: string;
			img: string;
			label: string;
		}
	>;
}

export type Template = {
	id: string;
	subject: string;
	html: string;
	from: {
		email: string;
		name: string;
	};
};

export type MinimalTemplate = Omit<Template, 'id' | 'from'> & {
	from?: Partial<Template['from']>;
};
export type TemplateDefinition = (lang: Language) => MinimalTemplate;

export type TemplateId = (typeof ids)[number];
