import type { Language } from '@sveltevietnam/i18n';
import type { SocialEvent } from 'schema-dts';
import type { Picture } from 'vite-imagetools';

export type EventMetadata = {
	id: string;
	href: string;
	title: string;
	description: string;
	keywords: string;
	startDate?: Date;
	endDate?: Date;
	location?: {
		name: string;
		href?: string;
	}[];
	livestream?: {
		name: string;
		url: string;
	}[];
	thumbnail?: Picture;
	/** list of ids linking members that contributed to this event  */
	people?: string[];
};

export type MinimalEventMetadata = Omit<EventMetadata, 'id'>;
export type EventMetadataDefinition = (lang: Language) => MinimalEventMetadata;
export type EventAdditionalStructuredData = Partial<SocialEvent>;
export type EventAdditionalStructuredDataDefinition = (
	lang: Language,
	origin: string,
) => EventAdditionalStructuredData;

export type EventStatus = 'past' | 'ongoing' | 'upcoming';
