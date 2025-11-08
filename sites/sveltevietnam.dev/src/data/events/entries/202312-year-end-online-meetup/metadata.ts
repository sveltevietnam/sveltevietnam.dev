import { defineEventAdditionalStructuredData, defineEventMetadata } from '..';

export const EVENT_LINKS = {
	STREAM: 'https://www.youtube.com/watch?v=AUtnGxmYocw',
	JOIN: 'https://vdo.ninja/?room=2023_sveltevietnam_meetup&hash=9a0d&trb=2000&m&sl&l&tips',
	DISCORD: 'https://discord.gg/dUSMxnCT?event=1182232622647234560',
	VIDEO1: 'https://youtu.be/L109MSzC5nk',
	VIDEO2: 'https://youtu.be/BaoljjKpLIU',
};

export default defineEventMetadata((lang) => ({
	...{
		en: {
			href: '202312-year-end-online-meetup',
			title: 'Online Meetup Year-end 2023',
			description:
				'This is the first-ever online meetup of the Svelte Vietnam community, and also the last of 2023.',
			keywords: 'event, community, meetup, 2023, year-end, first',
		},
		vi: {
			href: '202312-gap-nhau-truc-tuyen-cuoi-nam',
			title: 'Gặp nhau trực tuyến cuối năm 2023',
			description:
				'Đây là buổi gặp mặt trực tuyến đầu tiên của cộng đồng Svelte Việt Nam và cũng là cuối cùng của năm dương lịch 2023.',
			keywords: 'sự kiện, cộng đồng, gặp mặt, 2023, cuối năm, đầu tiên',
		},
	}[lang],
	startDate: new Date('2023-12-16T02:00:00.000Z'),
	endDate: new Date('2023-12-16T04:00:00.000Z'),
	livestream: [
		{
			name: 'Youtube',
			url: EVENT_LINKS.STREAM,
		},
		{
			name: 'Discord',
			url: EVENT_LINKS.DISCORD,
		},
	],
	people: ['vnphanquang'],
}));

export const structured = defineEventAdditionalStructuredData(() => ({
	eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
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
}));
