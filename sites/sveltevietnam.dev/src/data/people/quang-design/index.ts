import { definePerson } from '..';

export default definePerson((lang) => ({
	links: {
		github: 'https://github.com/quang-design',
		website: 'https://www.quang.design/',
		bluesky: 'https://bsky.app/profile/quangdesign.bsky.social',
	},
	...{
		en: {
			name: 'Quang Nguyen',
			description: 'Design Engineer',
		},
		vi: {
			name: 'Quang Nguyen',
			description: 'Kĩ sư thiết kế',
		},
	}[lang],
}));
