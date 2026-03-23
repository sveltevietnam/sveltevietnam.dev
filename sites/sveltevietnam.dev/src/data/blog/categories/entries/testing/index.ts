import { defineBlogCategory } from '..';

export default defineBlogCategory((lang) => ({
	...{
		en: {
			name: 'Testing',
			slug: 'testing',
			description: 'QA/QC related articles about testing techniques, tools, case studies, ...',
		},
		vi: {
			name: 'Kiểm thử',
			slug: 'kiem-thu',
			description:
				'Bài viết xoay quanh các vấn đề kỹ thuật, thư viện, ví dụ thực tế, ... với kiểm thử phần mềm',
		},
	}[lang],
}));
