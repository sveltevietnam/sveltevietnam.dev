import type { MessageString } from '@sveltevietnam/i18n/runtime';
import type { SocialEvent } from 'schema-dts';
import type { Picture } from 'vite-imagetools';

export type EventMetadata = {
	id: string;
	slug: MessageString;
	title: MessageString;
	description: MessageString;
	keywords: MessageString;
	startDate: Date;
	endDate: Date;
	location?: {
		address: MessageString;
		googleMapUrl: string;
	}[];
	livestream?: {
		name: string;
		url: string;
	}[];
	thumbnail?: Picture;
};

export type MinimalEventMetadata = Omit<EventMetadata, 'id'>;
export type EventMetadataDefinition = (lang: App.Language) => MinimalEventMetadata;
export type EventAdditionalStructuredData = Partial<SocialEvent>;
export type EventAdditionalStructuredDataDefinition = (
	lang: App.Language,
	origin: string,
) => EventAdditionalStructuredData;
