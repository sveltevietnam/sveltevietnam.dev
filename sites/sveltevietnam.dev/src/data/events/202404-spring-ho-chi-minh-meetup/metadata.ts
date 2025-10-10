import { defineEventAdditionalStructuredData, defineEventMetadata } from '..';

import * as m from './locales/generated/messages';

export default defineEventMetadata((lang) => ({
	href: m.slug(lang).toString(),
	title: m.title(lang).toString(),
	description: m.desc(lang).toString(),
	keywords: m.keywords(lang).toString(),
	startDate: new Date('2024-04-20T02:00:00.000Z'),
	endDate: new Date('2024-04-20T04:00:00.000Z'),
	location: [
		{
			href: 'https://maps.app.goo.gl/ymGh3Djmwjnb7ohu5',
			name: m.address(lang).toString(),
		},
	],
	people: ['trongnguyen24', 'vnphanquang'],
}));

export const structured = defineEventAdditionalStructuredData(() => ({
	eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
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
}));
