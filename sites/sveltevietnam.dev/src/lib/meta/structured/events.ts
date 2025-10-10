import type { Language } from '@sveltevietnam/i18n';
import { buildStructuredTextWithLang } from '@sveltevietnam/kit/utilities/structured-data';
import type { SocialEvent } from 'schema-dts';

import type { EventMetadata } from '$data/events';
import * as p from '$data/routes/generated';

import { buildStructuredOrganization } from './organization';

export function buildStructuredEvent(
	lang: Language,
	origin: string,
	event: EventMetadata,
	additionals?: Partial<SocialEvent> | null,
): SocialEvent {
	const canonical = event.href.startsWith('http')
		? event.href
		: origin + p['/:lang/events/:slug']({ lang, slug: event.href });
	const org = buildStructuredOrganization(lang, origin);
	const id = `${org['@id']}/events/${event.id}`;
	return {
		'@type': 'SocialEvent',
		'@id': id,
		url: buildStructuredTextWithLang({ lang, value: canonical }),
		mainEntityOfPage: buildStructuredTextWithLang({ lang, value: canonical }),
		name: buildStructuredTextWithLang({ lang, value: event.title }),
		description: buildStructuredTextWithLang({ lang, value: event.description }),
		keywords: buildStructuredTextWithLang({ lang, value: event.keywords }),
		...(event.startDate instanceof Date && {
			startDate: event.startDate.toISOString(),
		}),
		...(event.endDate instanceof Date && {
			endDate: event.endDate.toISOString(),
		}),
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
