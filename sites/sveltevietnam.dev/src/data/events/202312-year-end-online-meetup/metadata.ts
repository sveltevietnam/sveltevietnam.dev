import { defineEventAdditionalStructuredData, defineEventMetadata } from '..';

import * as m from './locales/generated/messages';

export const EVENT_LINKS = {
	STREAM: 'https://www.youtube.com/watch?v=AUtnGxmYocw',
	JOIN: 'https://vdo.ninja/?room=2023_sveltevietnam_meetup&hash=9a0d&trb=2000&m&sl&l&tips',
	DISCORD: 'https://discord.gg/dUSMxnCT?event=1182232622647234560',
	VIDEO1: 'https://youtu.be/L109MSzC5nk',
	VIDEO2: 'https://youtu.be/BaoljjKpLIU',
};

export default defineEventMetadata((lang) => ({
	slug: m.slug(lang),
	title: m.title(lang),
	description: m.desc(lang),
	keywords: m.keywords(lang),
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
