import { defineBlogCategory } from '..';

export const en = defineBlogCategory({
	name: 'Community',
	slug: 'community',
	description: 'Sharing about events from Svelte Vietnam, open source contribution, and community-building and friend-making activites',
});

export const vi = defineBlogCategory({
	name: 'Cộng đồng',
	slug: 'cong-dong',
	description: 'Chia sẻ về sự kiện của Svelte Việt Nam, dự án mã nguồn mở, và các hoạt động xây dựng cộng đồng',
});
