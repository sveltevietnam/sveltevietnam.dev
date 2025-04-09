import { definePerson } from '..';
import * as m from '../locales/generated/messages';

export default definePerson((lang) => ({
	name: m['vnphanquang.name'](lang),
	description: m['vnphanquang.desc'](lang),
	links: {
		website: 'https://vnphanquang.com',
		bluesky: 'https://bsky.app/profile/vnphanquang.com',
		github: 'https://github.com/vnphanquang',
	},
}));
