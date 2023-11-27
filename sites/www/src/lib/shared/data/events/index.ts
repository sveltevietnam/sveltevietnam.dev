export * from './types';

import type { Language } from '$shared/services/i18n';

import { localizeEvent } from './helpers';
import type { LocalizedEvent } from './types';

// eslint-disable-next-line import/order
// HYGEN MARKER - IMPORT [DO NOT REMOVE]

export const EVENTS = [
	// HYGEN MARKER - POST [DO NOT REMOVE]
];

export function listEvents(language: Language) {
	const ongoing: LocalizedEvent[] = [];
	const upcoming: LocalizedEvent[] = [];
	const past: LocalizedEvent[] = [];
	for (let i = 0; i < EVENTS.length; i++) {
		const event = localizeEvent(language, EVENTS[i]);

		const now = new Date();
		if (event.startDate.toUpperCase() === 'TBA') {
			upcoming.push(event);
			continue;
		}
		const startDate = new Date(event.startDate);
		if (startDate > now) {
			upcoming.push(event);
			continue;
		}
		if (
			startDate <= now &&
			(event.endDate.toUpperCase() === 'TBA' || new Date(event.startDate) > now)
		) {
			ongoing.push(event);
			continue;
		}

		past.push(event);
	}
	console.log(ongoing, upcoming, past);
	return { ongoing, upcoming, past };
}
