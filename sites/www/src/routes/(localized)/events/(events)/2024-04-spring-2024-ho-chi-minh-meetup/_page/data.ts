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
		vi: 'Sự kiện gặp mặt trực tiếp đầu tiên của cộng đồng Svelte Việt Nam tại thành phố Hồ Chí Minh, đồng tổ chức bởi Designveloper',
		en: 'The first offline meetup for the Svelte Vietnam community in Hồ Chí Minh city, hosted by Designveloper',
	},
	startDate: '2024-04-20T02:00:00.000Z',
	endDate: '2024-04-20T04:00:00.000Z',
	location: {
		vi: 'Designveloper, 55 Phó Đức Chính, Quận 1, TP. Hồ Chí Minh',
		en: 'Designveloper, 55 Phó Đức Chính, Dist. 1, Hồ Chí Minh City',
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
	eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
	image: `${url.origin}/${lEvent.ogImage}`,
	eventStatus: 'https://schema.org/EventScheduled',
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
		{
			'@type': 'Place',
			name: 'Designveloper',
			address: {
				'@type': 'PostalAddress',
				addressLocality: 'District 1',
				addressCountry: 'Việt Nam',
				addressRegion: 'Hồ Chí Minh City',
				streetAddress: '55 Phó Đức Chính',
				postalCode: '7000000',
				url: 'https://maps.app.goo.gl/KwjvqenCp6e6WFj88',
			},
		},
	],
	inLanguage: 'vi',
	organizer: SVELTE_VIETNAM_ORG,
	performer: Object.values(lEvent.speakers).map((speaker) => structurePerson(url, speaker)),
})) satisfies StructureEvent;
