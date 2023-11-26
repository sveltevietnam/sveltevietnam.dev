import type { Person } from '$shared/data/people';
import type { LangVar } from '$shared/services/i18n';
import type { Sponsor } from '$shared/types';

export type Event = {
	slug: string;
	startDate: string;
	endDate: string;
	title: LangVar<string>;
	location: LangVar<string>;
	description: LangVar<string>;
	speakers: Person[];
	sponsors: Sponsor[];
};
