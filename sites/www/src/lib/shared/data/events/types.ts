import type { WithContext, Event as StructuredEvent } from 'schema-dts';

import type { Person } from '$shared/data/people';
import type { LangVar, Language } from '$shared/services/i18n';
import type { Sponsor } from '$shared/types';

import type { localizeEvent } from './helpers';

export type Event = {
	slug: string;
	startDate: string;
	endDate: string;
	title: LangVar<string>;
	location: LangVar<string>;
	description: LangVar<string>;
	speakers: Person[];
	sponsors: Sponsor[];
	keywords: LangVar<string[]>;
	ogImage: LangVar<string>;
	thumbnail: LangVar<string>;
};

export type StructureEvent = (
	lEvent: ReturnType<typeof localizeEvent>,
	language: Language,
) => WithContext<StructuredEvent>;
