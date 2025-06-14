import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	publishedAt: new Date('2025-06-11'),
	authors: ['anhtuank7c', 'liti-dev'],
	categories: ['community'],
	series: ['people-of-svelte'],
	...(
		{
			en: {
				slug: '20250611-tuan-nguyen-code-as-a-tool-value-as-the-goal',
				title: 'Tuan Nguyen - Code as a tool, value as the goal',
				description:
					'Tuan Nguyen is a strategist, a systems thinker, and someone who’s built his career on execution.',
				keywords: 'leadership, business',
				translation: 'original',
				// TODO: update these information once you finish writing
				readMinutes: 2,
				numWords: 595,
			},
			vi: {
				slug: '20250611-tuan-nguyen-code-la-phuong-tien-gia-tri-moi-la-dich-den',
				title: 'Tuấn Nguyễn - Code là phương tiện, giá trị mới là đích đến',
				description:
					'Tuấn Nguyễn là một người có tư duy chiến lược và đã có hơn 15 năm kinh nghiệm lập trình.',
				keywords: 'lãnh đạo, doanh nghiệp',
				translation: 'manual',
				// TODO: update these information once you finish writing
				readMinutes: 3,
				numWords: 769,
			},
		} as const
	)[lang],
}));
