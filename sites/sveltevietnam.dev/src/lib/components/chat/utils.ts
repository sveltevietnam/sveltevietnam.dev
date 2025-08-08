import type { Language } from '@sveltevietnam/i18n';

import { loadPerson } from '$data/people';
import * as p from '$data/routes/generated';

import type { ChatParticipantMap } from './context';

export function loadParticipants(ids: string[], lang: Language): ChatParticipantMap {
	return Object.fromEntries(
		ids.map((id) => [
			id,
			loadPerson(id, lang, { avatar: true }).then((person) =>
				person
					? {
							...person,
							href: p['/:lang/people/:id']({ lang, id: person.id }),
						}
					: null,
			),
		]),
	);
}
