import { definePerson } from '..';

export default definePerson((lang) => ({
	links: {
		github: 'https://github.com/liti-dev',
		bluesky: 'https://bsky.app/profile/tia-nguyen.bsky.social',
		linkedin: 'https://www.linkedin.com/in/thuyet-ng-03/',
	},
	...{
		en: {
			name: 'Thuyet (Tia) Nguyen',
			description: 'Developer',
		},
		vi: {
			name: 'Thuyet (Tia) Nguyen',
			description: 'Lập trình viên',
		},
	}[lang],
}));
