export * from './types';

// HYGEN MARKER - IMPORT [DO NOT REMOVE]
import type { Language } from '$shared/services/i18n';

import { getEventStatus, localizeEvent } from './helpers';
import type { LocalizedEvent } from './types';

export const EVENTS = [
	// HYGEN MARKER - POST [DO NOT REMOVE]
];

export function listEvents(language: Language) {
	const ongoing: LocalizedEvent[] = [];
	const upcoming: LocalizedEvent[] = [];
	const past: LocalizedEvent[] = [];
	for (let i = 0; i < EVENTS.length; i++) {
		const event = localizeEvent(language, EVENTS[i]);

		switch (getEventStatus(event)) {
			case 'upcoming':
				upcoming.push(event);
				break;
			case 'ongoing':
				ongoing.push(event);
				break;
			case 'past':
				past.push(event);
				break;
		}
	}
	return { ongoing, upcoming, past };
}
