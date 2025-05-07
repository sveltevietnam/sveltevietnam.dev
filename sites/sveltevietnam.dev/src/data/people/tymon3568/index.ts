import { definePerson } from '..';
import * as m from '../locales/generated/messages';

export default definePerson((lang) => ({
	name: m['tymon3568.name'](lang),
	description: m['tymon3568.desc'](lang),
	links: {
		x: 'https://x.com/Tymon3568',
		github: 'https://github.com/tymon3568',
	},
}));
