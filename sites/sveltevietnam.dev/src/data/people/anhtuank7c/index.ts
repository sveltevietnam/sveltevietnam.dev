import { definePerson } from '..';

export default definePerson((lang) => ({
	links: {
		github: 'https://github.com/anhtuank7c',
		website: 'https://anhtuank7c.dev/',
		linkedin: 'https://vn.linkedin.com/in/anhtuank7c',
	},
	...{
		en: {
			name: 'Tuan Nguyen',
			description: 'CTO, digital creator',
		},
		vi: {
			name: 'Tuấn Nguyễn',
			description: 'Giám đốc công nghệ, sáng tạo nội dung',
		},
	}[lang],
}));
