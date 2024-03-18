import type { Event, StructureEvent } from '$lib/data/events';
import { VNPHANQUANG } from '$lib/data/people';
import { SVELTE_VIETNAM_ORG, structurePerson } from '$lib/data/structured';

import ogImageEn from './images/og-en.jpg';
import ogImageVi from './images/og-vi.jpg';
import thumbnail from './images/thumbnail.jpg?enhanced&w=800&imagetools';

export const EVENT_LINKS = {
	STREAM: 'https://www.youtube.com/watch?v=AUtnGxmYocw',
	JOIN: 'https://vdo.ninja/?room=2023_sveltevietnam_meetup&hash=9a0d&trb=2000&m&sl&l&tips',
	DISCORD: 'https://discord.gg/dUSMxnCT?event=1182232622647234560',
	VIDEO1: 'https://youtu.be/L109MSzC5nk',
	VIDEO2: 'https://youtu.be/BaoljjKpLIU',
};

export const event = {
	slug: {
		en: '202312-year-end-online-meetup',
		vi: '202312-gap-nhau-truc-tuyen-cuoi-nam',
	},
	title: {
		vi: 'Gặp nhau trực tuyến cuối năm 2023',
		en: 'Online Meetup Year-end 2023',
	},
	description: {
		vi: 'Đây là buổi gặp mặt trực tuyến đầu tiên của cộng đồng Svelte Việt Nam và cũng là cuối cùng của năm dương lịch 2023.',
		en: 'This is the first-ever online meetup of the Svelte Vietnam community, and also the last of 2023.',
	},
	startDate: '2023-12-16T02:00:00.000Z',
	endDate: '2023-12-16T04:00:00.000Z',
	location: {
		vi: `Trực tuyến tại <a class="c-link" href="${EVENT_LINKS.STREAM}" target="_blank" rel="noreferrer">Youtube</a> và <a class="c-link" href="${EVENT_LINKS.DISCORD}" target="_blank" rel="noreferrer">Discord</a>`,
		en: `Live via <a class="c-link" href="${EVENT_LINKS.STREAM}" target="_blank" rel="noreferrer">Youtube</a> and <a class="c-link" href="${EVENT_LINKS.DISCORD}" target="_blank" rel="noreferrer">Discord</a>`,
	},
	speakers: {
		vnphanquang: VNPHANQUANG,
	},
	sponsors: [],
	keywords: {
		vi: ['sự kiện', 'cộng đồng', 'gặp mặt', '2023', 'cuối năm', 'đầu tiên'],
		en: ['event', 'community', 'meetup', '2023', 'year-end', 'first'],
	},
	thumbnail,
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
	eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
	image: `${url.origin}/${lEvent.ogImage}`,
	eventStatus: 'https://schema.org/EventScheduled',
	location: [
		{
			'@type': 'VirtualLocation',
			name: 'Youtube',
			url: EVENT_LINKS.STREAM,
		},
		{
			'@type': 'VirtualLocation',
			name: 'Discord',
			url: EVENT_LINKS.DISCORD,
		},
	],
	inLanguage: 'vi',
	organizer: SVELTE_VIETNAM_ORG,
	performer: Object.values(lEvent.speakers).map((speaker) => structurePerson(url, speaker)),
})) satisfies StructureEvent;
