import type { BreadcrumbList, WithContext } from 'schema-dts';

import { localizePerson } from '$shared/data/people';
import { resolveLangVar, type Language } from '$shared/services/i18n';
import { EVENTS_PATH, ROOT_URL, getPathLabel } from '$shared/services/navigation';

import type { Event, StructureEvent } from './types';

export function localizeEvent(language: Language, event: Event) {
	return {
		...event,
		title: resolveLangVar(language, event.title),
		location: resolveLangVar(language, event.location),
		description: resolveLangVar(language, event.description),
		speakers: event.speakers.map((speaker) => localizePerson(language, speaker)),
		keywords: resolveLangVar(language, event.keywords),
		ogImage: resolveLangVar(language, event.ogImage),
		thumbnail: resolveLangVar(language, event.thumbnail),
		sponsors: event.sponsors.map((sponsor) => ({
			...sponsor,
			name: resolveLangVar(language, sponsor.name),
		})),
	};
}

export function preparePageData(language: Language, event: Event, structure: StructureEvent) {
	const lEvent = localizeEvent(language, event);
	const canonical = `${ROOT_URL}/${language}${EVENTS_PATH}/${lEvent.slug}`;
	return {
		event: lEvent,
		meta: {
			title: lEvent.title,
			description: lEvent.description,
			keywords: lEvent.keywords,
			og: {
				type: 'article' as const,
				image: lEvent.ogImage,
				imageAlt: lEvent.title,
			},
			canonical,
			structured: JSON.stringify([
				{
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: [
						{
							'@type': 'ListItem',
							position: 1,
							name: getPathLabel(EVENTS_PATH, language),
							item: `${ROOT_URL}/${language}${EVENTS_PATH}`,
						},
						{
							'@type': 'ListItem',
							position: 2,
							name: lEvent.title,
							item: canonical,
						},
					],
				} as WithContext<BreadcrumbList>,
				structure(lEvent, language),
			]),
		} satisfies App.PageData['meta'],
	};
}
