import { defineBlogSeries } from '..';

export default defineBlogSeries((lang) => ({
	name: 'Mini Snippet',
	slug: 'mini-snippet',
	...{
		en: {
			description:
				'Collections of short articles with sharp focus on particular problem, solution, or dicussion from a typical day-to-day work in the Svelte ecosystem',
		},
		vi: {
			description:
				'Tập hợp các bài viết ngắn, tập trung giải quyết một vấn đề cụ thể, hoặc bàn về công việc mỗi ngày khi làm việc trong hệ sinh thái Svelte',
		},
	}[lang],
}));
