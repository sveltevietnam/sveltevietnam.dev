import { defineEventAdditionalStructuredData, defineEventMetadata } from '..';

export default defineEventMetadata((lang) => ({
	...{
		en: {
			href: '202404-spring-ho-chi-minh-meetup',
			title: 'Spring 2024 Ho Chi Minh Meetup',
			description:
				'The first offline meetup for the Svelte Vietnam community in Hồ Chí Minh city, hosted by Designveloper',
			keywords: 'event, community, meetup, Ho Chi Minh',
		},
		vi: {
			href: '202404-gap-mat-xuan-giap-thin-ho-chi-minh',
			title: 'Gặp mặt Xuân Giáp Thìn 2024 - Hồ Chí Minh',
			description:
				'Sự kiện gặp mặt trực tiếp đầu tiên của cộng đồng Svelte Việt Nam tại thành phố Hồ Chí Minh, đồng tổ chức bởi Designveloper',
			keywords: 'sự kiện, cộng đồng, gặp mặt, Hồ Chí Minh',
		},
	}[lang],
	startDate: new Date('2024-04-20T02:00:00.000Z'),
	endDate: new Date('2024-04-20T04:00:00.000Z'),
	location: [
		{
			href: 'https://maps.app.goo.gl/ymGh3Djmwjnb7ohu5',
			name: {
				en: 'Designveloper, 6th floor, 55 Pho Duc Chinh, Dist. 1, Ho Chi Minh City',
				vi: 'Designveloper, tầng 6, 55 Phó Đức Chính, Quận 1, TP. Hồ Chí Minh',
			}[lang],
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
