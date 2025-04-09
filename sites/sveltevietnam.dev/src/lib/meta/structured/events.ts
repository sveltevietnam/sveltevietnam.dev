import type { SocialEvent } from 'schema-dts';

import type { EventMetadata } from '$data/events';
import { loadRoutingMap } from '$data/routing';
import { build } from '$lib/routing/utils';

import { buildStructuredOrganization } from './organization';
import { buildStructuredTextWithLang } from './utils';

export function buildStructuredEvent(
	lang: App.Language,
	origin: string,
	event: EventMetadata,
	additionals?: Partial<SocialEvent> | null,
): SocialEvent {
	const routingMap = loadRoutingMap();
	const canonical = origin + build(routingMap[lang]['events/:slug'].path, event.slug);
	const org = buildStructuredOrganization(lang);
	const id = `${org['@id']}/events/${event.id}`;
	return {
		'@type': 'SocialEvent',
		'@id': id,
		url: buildStructuredTextWithLang(lang, canonical),
		mainEntityOfPage: buildStructuredTextWithLang(lang, canonical),
		name: buildStructuredTextWithLang(lang, event.title),
		description: buildStructuredTextWithLang(lang, event.description),
		keywords: buildStructuredTextWithLang(lang, event.keywords),
		startDate: event.startDate,
		endDate: event.endDate,
		inLanguage: lang,
		organizer: org,
		...(event.thumbnail && {
			image: {
				'@type': 'ImageObject',
				'@id': `${id}/image`,
				url: origin + event.thumbnail.img.src,
				width: event.thumbnail.img.w.toString(),
				height: event.thumbnail.img.h.toString(),
			},
		}),
		...additionals,
	};
}
