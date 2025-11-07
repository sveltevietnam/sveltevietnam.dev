import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	publishedAt: new Date('2025-05-22'),
	authors: ['trongnguyen24', 'liti-dev'],
	categories: ['community'],
	series: ['people-of-svelte'],
	...(
		{
			en: {
				slug: '20250522-nguyen-le-not-a-javascript-developer-but-look-what-he-built',
				title: 'Nguyen Le - Not a JavaScript Developer (But Look What He Built)',
				description:
					'Nguyen’s story is a quiet spark in the big Svelte mosaic. It’s not about being perfect, or fast; it’s about showing up with care, making things for others, and learning your way through.',
				keywords: 'designer, extension, fire',
				translation: 'original',
				readMinutes: 3,
				numWords: 500,
			},
			vi: {
				slug: '20250522-nguyen-le-khong-ranh-javascript-nhung-san-pham-chat-khoi-ban',
				title: 'Nguyên Lê - Không rành JavaScript (nhưng sản phẩm chất khỏi bàn)',
				description:
					'Nguyên giống như một đốm sáng lặng lẽ trong bức tranh đầy màu sắc của cộng đồng Svelte. Không cần hoàn hảo, nhanh gọn, chỉ kiên trì đóng góp và học hỏi không ngừng.',
				keywords: 'thiết kế viên, ứng dụng mở rộng, lửa',
				translation: 'manual',
				readMinutes: 3,
				numWords: 500,
			},
		} as const
	)[lang],
}));
