import { definePerson } from '..';

export default definePerson((lang) => ({
	links: {
		website: 'https://nguyenle.pages.dev',
		github: 'https://github.com/trongnguyen24',
	},
	...{
		en: {
			name: 'Nguyên Lê',
			description: 'UI/UX designer — Member of Svelte Vietnam community',
		},
		vi: {
			name: 'Lê Nguyên',
			description: 'Thiết kế viên UI/UX — Thành viên cộng đồng Svelte Việt Nam',
		},
	}[lang],
}));
