export * from './types';
export * from './helpers';

import { event as event_202312_year_end_online_meetup } from '$routes/(localized)/events/(events)/202312-year-end-online-meetup/_page/data';
import { event as post_2024_04_spring_2024_ho_chi_minh_meetup } from '$routes/(localized)/events/(events)/2024-04-spring-2024-ho-chi-minh-meetup/_page/data';
// HYGEN MARKER - IMPORT [DO NOT REMOVE]

import { getEventStatus, localizeEvent } from './helpers';
import type { LocalizedEvent } from './types';

export const EVENTS = [
	// HYGEN MARKER - EVENT [DO NOT REMOVE]
	post_2024_04_spring_2024_ho_chi_minh_meetup,
	event_202312_year_end_online_meetup,
];

export function listEvents(language: App.Language) {
	const ongoing: LocalizedEvent[] = [];
	const upcoming: LocalizedEvent[] = [];
	const past: LocalizedEvent[] = [];
	for (let i = 0; i < EVENTS.length; i++) {
		const event = localizeEvent(language, EVENTS[i]) as LocalizedEvent;

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
