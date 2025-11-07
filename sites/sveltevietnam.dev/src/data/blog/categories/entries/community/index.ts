import { defineBlogCategory } from '..';

export default defineBlogCategory((lang) => ({
	...{
		en: {
			name: 'Community',
			slug: 'community',
			description:
				'Sharing about events from Svelte Vietnam, open source contribution, and community-building activities',
		},
		vi: {
			name: 'Cộng đồng',
			slug: 'cong-dong',
			description:
				'Chia sẻ về sự kiện của Svelte Việt Nam, dự án mã nguồn mở, và các hoạt động xây dựng cộng đồng',
		},
	}[lang],
}));
