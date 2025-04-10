import type { SocialEvent } from 'schema-dts';
import type { Picture } from 'vite-imagetools';

export type EventMetadata = {
	id: string;
	slug: string;
	title: string;
	description: string;
	keywords: string;
	startDate: Date;
	endDate: Date;
	location?: {
		address: string;
		googleMapUrl: string;
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
export type EventMetadataDefinition = (lang: App.Language) => MinimalEventMetadata;
export type EventAdditionalStructuredData = Partial<SocialEvent>;
export type EventAdditionalStructuredDataDefinition = (
	lang: App.Language,
	origin: string,
) => EventAdditionalStructuredData;
