import type { SocialEvent } from 'schema-dts';

import type { EventMetadata } from '$data/events';
import * as p from '$data/routes/generated';

import { buildStructuredOrganization } from './organization';
import { buildStructuredTextWithLang } from './utils';

export function buildStructuredEvent(
	lang: App.Language,
	origin: string,
	event: EventMetadata,
	additionals?: Partial<SocialEvent> | null,
): SocialEvent {
	const canonical = origin + p['/:lang/events/:slug']({ lang, slug: event.slug });
	const org = buildStructuredOrganization(lang, origin);
	const id = `${org['@id']}/events/${event.id}`;
	return {
		'@type': 'SocialEvent',
		'@id': id,
		url: buildStructuredTextWithLang(lang, canonical),
		mainEntityOfPage: buildStructuredTextWithLang(lang, canonical),
		name: buildStructuredTextWithLang(lang, event.title),
		description: buildStructuredTextWithLang(lang, event.description),
		keywords: buildStructuredTextWithLang(lang, event.keywords),
		startDate: event.startDate.toISOString(),
		endDate: event.endDate.toISOString(),
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
