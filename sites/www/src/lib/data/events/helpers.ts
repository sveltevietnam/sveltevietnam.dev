import { LANGUAGES, delocalizeLangVar, localizeLangVar } from '@internals/utils/language';
import { delocalizeUrl } from '@internals/utils/url';
import type { BreadcrumbList, WithContext } from 'schema-dts';

import { ROUTE_MAP } from '$lib/contexts/navigation';
import { localizePerson } from '$lib/data/people';

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

export function findEventBySlug(lang: App.Language, events: Event[], slug?: string) {
	if (!slug) return undefined;
	return events.find((e) => localizeLangVar(lang, e.slug) === slug);
}

export function isUrlEventDetail(url: URL | string): boolean {
	return /^\/(?:events|su-kien)\/.+$/.test(
		delocalizeUrl(typeof url === 'string' ? url : url.pathname, LANGUAGES),
	);
}

export function localizeEvent<E extends Event>(language: App.Language, event: E) {
	return {
		...event,
		slug: localizeLangVar(language, event.slug),
		title: localizeLangVar(language, event.title),
		location: localizeLangVar(language, event.location),
		description: localizeLangVar(language, event.description),
		speakers: Object.fromEntries(
			Object.entries(event.speakers).map(([key, speaker]) => [
				key,
				localizePerson(language, speaker),
			]),
		) as Record<keyof E['speakers'], ReturnType<typeof localizePerson>>,
		...(event.keywords && {
			keywords: localizeLangVar(language, event.keywords),
		}),
		...(event.ogImage && {
			ogImage: localizeLangVar(language, event.ogImage),
		}),
		...(event.thumbnail && {
			thumbnail: localizeLangVar(language, event.thumbnail),
		}),
		sponsors: event.sponsors.map((sponsor) => ({
			...sponsor,
			name: localizeLangVar(language, sponsor.name),
		})),
	};
}

export function preparePageData<E extends Event>(
	url: URL,
	language: App.Language,
	event: E,
	structure: StructureEvent,
) {
	const lEvent = localizeEvent(language, event);
	const currentEventRoute = ROUTE_MAP.events[language];
	const canonicalPath = `${currentEventRoute.path}/${lEvent.slug}`;
	const canonicalUrl = `${url.origin}${canonicalPath}`;

	const delocalizedSlug = delocalizeLangVar(event.slug);
	const delocalizedTitle = delocalizeLangVar(event.title);
	return {
		route: {
			current: {
				key: delocalizedSlug.en,
				label: lEvent.title,
				path: canonicalPath,
			},
			alternate: {
				en: {
					label: delocalizedTitle.en,
					path: `${ROUTE_MAP.events.en.path}/${delocalizedSlug.en}`,
				},
				vi: {
					label: delocalizedTitle.vi,
					path: `${ROUTE_MAP.events.vi.path}/${delocalizedSlug.vi}`,
				},
			},
		} as App.PageData['route'],
		event: lEvent,
		meta: {
			title: lEvent.title,
			description: lEvent.description,
			keywords: lEvent.keywords,
			canonical: canonicalUrl,
			og: {
				type: 'article' as const,
				image: lEvent.ogImage,
				imageAlt: lEvent.title,
			},
			structured: JSON.stringify([
				{
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: [
						{
							'@type': 'ListItem',
							position: 1,
							name: currentEventRoute.label,
							item: `${url.origin}${currentEventRoute.path}`,
						},
						{
							'@type': 'ListItem',
							position: 2,
							name: lEvent.title,
							item: canonicalUrl,
						},
					],
				} as WithContext<BreadcrumbList>,
				structure(url, lEvent, language),
			]),
		} satisfies App.PageData['meta'],
	};
}
