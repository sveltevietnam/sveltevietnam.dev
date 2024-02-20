import type { Event, StructureEvent } from '$lib/data/events';
// import { VNPHANQUANG } from '$lib/data/people';
import { SVELTE_VIETNAM_ORG, structurePerson } from '$lib/data/structured';

import ogImageEn from './images/thumbnail-en.jpg';
import thumbnailEn from './images/thumbnail-en.jpg?enhanced';
import ogImageVi from './images/thumbnail-vi.jpg';
import thumbnailVi from './images/thumbnail-vi.jpg?enhanced';

export const EVENT_ID = 'spring-2024-HCM-meetup';

export const event = {
	slug: {
		en: '2024-04-spring-2024-ho-chi-minh-meetup',
		vi: '2024-04-gap-mat-xuan-giap-thin-2024-ho-chi-minh',
	},
	title: {
		vi: 'Gặp mặt Xuân Giáp Thìn 2024 - Hồ Chí Minh',
		en: 'Spring 2024 Ho Chi Minh Meetup',
	},
	description: {
		vi: '',
		en: '',
	},
	startDate: '2024-04-20T02:00:00.000Z',
	endDate: '2024-04-20T04:00:00.000Z',
	location: {
		vi: 'TP. Hồ Chí Minh (Chi tiết thông báo sau)',
		en: 'Ho Chi Minh city (Specifics are to be announced)',
	},
	speakers: {
		// vnphanquang: VNPHANQUANG,
	},
	sponsors: [],
	keywords: {
		vi: ['sự kiện', 'cộng đồng', 'gặp mặt', 'Hồ Chí Minh'],
		en: ['event', 'community', 'meetup', 'Ho Chi Minh'],
	},
	thumbnail: {
		vi: thumbnailVi,
		en: thumbnailEn,
	},
	ogImage: {
		vi: ogImageVi,
		en: ogImageEn,
	},
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
