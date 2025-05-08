import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	publishedAt: new Date('2023-12-04'),
	authors: ['vnphanquang'],
	categories: ['insider'],
	series: ['behind-the-screen'],
	...(
		{
			en: {
				slug: '20231204-behind-the-screen-a-few-secrets-of-sveltevietnam-dev',
				title: 'A Few Secrets of sveltevietnam.dev',
				description:
					'They are not that secret, just quite unnoticeable, but these small details really help enhance the user experience',
				keywords: 'progressive enhancement, secret, accessibility, user experience',
				readMinutes: 8,
				numWords: 1890,
				translation: 'manual',
			},
			vi: {
				slug: '20231204-behind-the-screen-mot-vai-bi-mat-ve-sveltevietnam-dev',
				title: 'Một vài bí mật về sveltevietnam.dev',
				description:
					'Cũng không bí mật gì lắm, chỉ là một vài chi tiết tỉ mỉ ít được nhắc đến, giúp hoàn thiện hơn trải nghiệm người dùng',
				keywords: 'bí mật, cải thiện tăng dần, trợ năng, trải nghiệm người dùng',
				readMinutes: 10,
				numWords: 2460,
				translation: 'original',
			},
		} as const
	)[lang],
}));
