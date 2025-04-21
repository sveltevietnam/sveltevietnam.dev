import type { Person } from 'schema-dts';

import * as p from '$data/routes/generated';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';

import { buildStructuredTextWithLang } from './utils';

export function buildStructuredPerson(
	lang: App.Language,
	origin: string,
	person: import('$data/people').Person,
): Person {
	const canonical = origin + p['/:lang/people/:id']({ lang, id: person.id });
	const id = `${VITE_PUBLIC_ORIGIN}/people/${person.id}`;
	return {
		'@type': 'Person',
		'@id': id,
		url: buildStructuredTextWithLang(lang, canonical),
		name: buildStructuredTextWithLang(lang, person.name),
		description: buildStructuredTextWithLang(lang, person.description),
		...(person.avatar && {
			image: {
				'@type': 'ImageObject',
				'@id': `${id}/image`,
				url: origin + person.avatar.img.src,
				width: person.avatar.img.w.toString(),
				height: person.avatar.img.h.toString(),
			},
		}),
		...(person.links && {
			sameAs: Object.values(person.links),
		}),
	};
}
