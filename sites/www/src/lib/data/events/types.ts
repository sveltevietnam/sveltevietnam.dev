import type { LangVar } from '@internals/utils/language';
import type { WithContext, Event as StructuredEvent } from 'schema-dts';

import type { Person } from '$lib/data/people';
import type { Sponsor } from '$lib/data/sponors';

import type { localizeEvent } from './helpers';

export type Event = {
	id: string;
	slug: LangVar<string>;
	startDate: string;
	endDate: string;
	title: LangVar<string>;
	location: LangVar<string>;
	description: LangVar<string>;
	speakers: Record<string, Person>;
	sponsors: Sponsor[];
	keywords?: LangVar<string[]>;
	ogImage?: LangVar<string>;
	thumbnail?: LangVar<string>;
};

export type LocalizedEvent = ReturnType<typeof localizeEvent>;

export type StructureEvent = (
	url: URL,
	lEvent: LocalizedEvent,
	language: App.Language,
) => WithContext<StructuredEvent>;

/** use .sub to get email */
export type EventQRCodeData = {
	event: string;
};
