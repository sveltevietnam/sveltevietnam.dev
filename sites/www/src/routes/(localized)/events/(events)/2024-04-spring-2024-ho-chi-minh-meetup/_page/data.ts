import type { Event, StructureEvent } from '$lib/data/events';
import { VNPHANQUANG } from '$lib/data/people';
import { SVELTE_VIETNAM_ORG, structurePerson } from '$lib/data/structured';

import ogImage from './images/og.jpg';
import thumbnail from './images/thumbnail.jpg?enhanced&w=800&imagetools';

export const event = {
	id: 'spring-2024-HCM-meetup',
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
		vi: '<a class="c-link c-link--preserved" href="https://maps.app.goo.gl/ymGh3Djmwjnb7ohu5" target="_blank" rel="noreferrer">Designveloper, tầng 6, 55 Phó Đức Chính, Quận 1, TP. Hồ Chí Minh</a>',
		en: '<a class="c-link c-link--preserved" href="https://maps.app.goo.gl/ymGh3Djmwjnb7ohu5" target="_blank" rel="noreferrer">Designveloper, 6th floor, 55 Pho Duc Chinh, Dist. 1, Ho Chi Minh City</a>',
	},
	speakers: {
		vnphanquang: VNPHANQUANG,
	},
	sponsors: [],
	keywords: {
		vi: ['sự kiện', 'cộng đồng', 'gặp mặt', 'Hồ Chí Minh'],
		en: ['event', 'community', 'meetup', 'Ho Chi Minh'],
	},
	thumbnail,
	ogImage,
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
		{
			'@type': 'Place',
			name: 'Designveloper',
			address: {
				'@type': 'PostalAddress',
				addressLocality: 'District 1',
				addressCountry: 'Vietnam',
				addressRegion: 'Ho Chi Minh City',
				streetAddress: '6th floor, 55 Pho Duc Chinh Street',
				postalCode: '7000000',
				url: 'https://maps.app.goo.gl/KwjvqenCp6e6WFj88',
			},
		},
	],
	inLanguage: 'vi',
	organizer: SVELTE_VIETNAM_ORG,
	performer: Object.values(lEvent.speakers).map((speaker) => structurePerson(url, speaker)),
})) satisfies StructureEvent;
