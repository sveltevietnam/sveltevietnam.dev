import { definePerson } from '..';

export default definePerson((lang) => ({
	links: {
		website: 'https://vnphanquang.com',
		bluesky: 'https://bsky.app/profile/vnphanquang.com',
		github: 'https://github.com/vnphanquang',
	},
	...{
		en: {
			name: 'Quang Phan',
			description: 'Developer, administrator',
		},
		vi: {
			name: 'Phan Quang',
			description: 'Lập trình viên, quản trị viên',
		},
	}[lang],
}));
