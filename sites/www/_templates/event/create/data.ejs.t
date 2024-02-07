---
to: <%= baseDir %>/_page/data.ts
unless_exists: true
---

import type { Event, StructureEvent } from '$lib/data/events';
import { VNPHANQUANG } from '$lib/data/people';
import { SVELTE_VIETNAM_ORG, structurePerson } from '$lib/data/structured';

// import ogImageEn from './images/thumbnail-en.jpg';
// import thumbnailEn from './images/thumbnail-en.jpg?enhanced';
// import ogImageVi from './images/thumbnail-vi.jpg';
// import thumbnailVi from './images/thumbnail-vi.jpg?enhanced';

export const event = {
	slug: {
		en: '<%= event.slug %>',
		vi: '<%= event.slug %>',
	},
	title: {
		vi: '<%= event.title %>',
		en: '<%= event.title %>',
	},
	description: {
		vi: '',
		en: '',
	},
	// ISO timestamp, use `Date.toISOString` for example
	// be careful with timezone
	startDate: '<%= event.date %>',
	endDate: '<%= event.date %>',
	location: {
		vi: '',
		en: '',
	},
	speakers: {
		vnphanquang: VNPHANQUANG,
	},
	sponsors: [],
	keywords: {
		vi: ['sự kiện', 'cộng đồng', 'gặp mặt'],
		en: ['event', 'community', 'meetup'],
	},
	// thumbnail: {
	// 	vi: thumbnailVi,
	// 	en: thumbnailEn,
	// },
	// ogImage: {
	// 	vi: ogImageVi,
	// 	en: ogImageEn,
	// },
} as const satisfies Event;

export const structure = ((url, lEvent) => ({
	'@context': 'https://schema.org',
	'@type': 'SocialEvent',
	name: lEvent.title,
	description: lEvent.description,
	startDate: lEvent.startDate,
	endDate: lEvent.endDate,
	// eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
	// image: `${url.origin}/${lEvent.ogImage}`,
	// eventStatus: 'https://schema.org/EventScheduled',
	location: [
		// {
		// 	'@type': 'VirtualLocation',
		// 	name: 'Youtube',
		// 	url: '',
		// },
		// {
		// 	'@type': 'VirtualLocation',
		// 	name: 'Discord',
		// 	url: '',
		// },
	],
	inLanguage: 'vi',
	organizer: SVELTE_VIETNAM_ORG,
	performer: Object.values(lEvent.speakers).map((speaker) => structurePerson(url, speaker)),
})) satisfies StructureEvent;
