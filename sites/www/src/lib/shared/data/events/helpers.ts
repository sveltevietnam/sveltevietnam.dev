import type { BreadcrumbList, WithContext } from 'schema-dts';

import { localizePerson } from '$shared/data/people';
import { resolveLangVar, type Language } from '$shared/services/i18n';
import { EVENTS_PATH, ROOT_URL, getPathLabel } from '$shared/services/navigation';

import type { Event, LocalizedEvent, StructureEvent } from './types';

export function getEventStatus(event: LocalizedEvent) {
	const now = new Date();
	if (event.startDate.toUpperCase() === 'TBA') {
		return 'upcoming';
	}
	const startDate = new Date(event.startDate);
	if (startDate > now) {
		return 'upcoming';
	}
	if (
		startDate <= now &&
		(event.endDate.toUpperCase() === 'TBA' || new Date(event.startDate) > now)
	) {
		return 'ongoing';
	}

	return 'past';
}

export function isEventWithinOneDay(event: LocalizedEvent) {
	if (event.startDate.toUpperCase() === event.endDate.toUpperCase()) {
		return true;
	}
	if (event.startDate.toUpperCase() === 'TBA' || event.endDate.toUpperCase() === 'TBA') {
		return false;
	}
	return (
		new Date(event.startDate).toLocaleDateString() === new Date(event.endDate).toLocaleDateString()
	);
}

export function localizeEvent<E extends Event>(language: Language, event: E) {
	return {
		...event,
		title: resolveLangVar(language, event.title),
		location: resolveLangVar(language, event.location),
		description: resolveLangVar(language, event.description),
		speakers: Object.fromEntries(
			Object.entries(event.speakers).map(([key, speaker]) => [
				key,
				localizePerson(language, speaker),
			]),
		) as Record<keyof E['speakers'], ReturnType<typeof localizePerson>>,
		keywords: resolveLangVar(language, event.keywords),
		ogImage: resolveLangVar(language, event.ogImage),
		thumbnail: resolveLangVar(language, event.thumbnail),
		sponsors: event.sponsors.map((sponsor) => ({
			...sponsor,
			name: resolveLangVar(language, sponsor.name),
		})),
	};
}

export function preparePageData<E extends Event>(
	language: Language,
	event: E,
	structure: StructureEvent,
) {
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
