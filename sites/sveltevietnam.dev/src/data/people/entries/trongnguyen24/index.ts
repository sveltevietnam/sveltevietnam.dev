import { definePerson } from '..';

export default definePerson((lang) => ({
	links: {
		website: 'https://nguyenle.pages.dev',
		github: 'https://github.com/trongnguyen24',
	},
	...{
		en: {
			name: 'Nguyên Lê',
			description: 'UI/UX designer',
		},
		vi: {
			name: 'Lê Nguyên',
			description: 'Thiết kế viên UI/UX',
		},
	}[lang],
}));
