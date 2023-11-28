import { SOCIAL_LINKS } from '$shared/constants';
import type { Event, StructureEvent } from '$shared/data/events';
import { people } from '$shared/data/people';
import { SVELTE_VIETNAM_ORG, structurePerson } from '$shared/data/structured';
import { ROOT_URL } from '$shared/services/navigation';

import ogImageEn from './images/thumbnail-en.jpg';
import thumbnailEn from './images/thumbnail-en.jpg?enhanced';
import ogImageVi from './images/thumbnail-vi.jpg';
import thumbnailVi from './images/thumbnail-vi.jpg?enhanced';

// TODO: replace with definite links once set up
export const EVENT_LINKS = {
	YOUTUBE: SOCIAL_LINKS.YOUTUBE,
	DISCORD: SOCIAL_LINKS.DISCORD,
};

export const event = {
	slug: '202312-year-end-online-meetup',
	title: {
		vi: 'Gặp nhau trực tuyến cuối năm 2023',
		en: 'Online Meetup Year-end 2023',
	},
	description: {
		vi: 'Đây là buổi gặp mặt trực tuyến đầu tiên của cộng đồng Svelte Việt Nam và cũng là cuối cùng của năm dương lịch 2023.',
		en: 'This is the first-ever online meetup of the Svelte Vietnam community, and also the last of 2023.',
	},
	startDate: '2023-12-23T02:00:00.000Z',
	endDate: '2023-12-23T04:30:00.000Z',
	location: {
		vi: `Trực tuyến tại <a class="c-link" href="${EVENT_LINKS.YOUTUBE}" target="_blank" rel="noreferrer">Youtube</a> và <a class="c-link" href="${EVENT_LINKS.DISCORD}" target="_blank" rel="noreferrer">Discord</a>`,
		en: `Live via <a class="c-link" href="${EVENT_LINKS.YOUTUBE}" target="_blank" rel="noreferrer">Youtube</a> and <a class="c-link" href="${EVENT_LINKS.DISCORD}" target="_blank" rel="noreferrer">Discord</a>`,
	},
	speakers: [people.vnphanquang],
	sponsors: [],
	keywords: {
		vi: ['sự kiện', 'cộng đồng', 'gặp mặt', '2023', 'cuối năm', 'đầu tiên'],
		en: ['event', 'community', 'meetup', '2023', 'year-end', 'first'],
	},
	thumbnail: {
		vi: thumbnailVi,
		en: thumbnailEn,
	},
	ogImage: {
		vi: ogImageVi,
		en: ogImageEn,
	},
} satisfies Event;

export const structure = ((lEvent) => ({
	'@context': 'https://schema.org',
	'@type': 'SocialEvent',
	name: lEvent.title,
	description: lEvent.description,
	startDate: lEvent.startDate,
	endDate: lEvent.endDate,
	eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
	image: ROOT_URL + lEvent.ogImage,
	eventStatus: 'https://schema.org/EventScheduled',
	location: [
		{
			'@type': 'VirtualLocation',
			name: 'Youtube',
			url: EVENT_LINKS.YOUTUBE,
		},
		{
			'@type': 'VirtualLocation',
			name: 'Discord',
			url: EVENT_LINKS.DISCORD,
		},
	],
	inLanguage: 'vi',
	organizer: SVELTE_VIETNAM_ORG,
	performer: lEvent.speakers.map(structurePerson),
})) satisfies StructureEvent;
