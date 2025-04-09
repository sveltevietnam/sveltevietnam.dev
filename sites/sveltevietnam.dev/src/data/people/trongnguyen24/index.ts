import { definePerson } from '..';
import * as m from '../locales/generated/messages';

export default definePerson((lang) => ({
	name: m['trongnguyen24.name'](lang),
	description: m['trongnguyen24.desc'](lang),
	links: {
		website: 'https://nguyenle.pages.dev',
	},
}));
