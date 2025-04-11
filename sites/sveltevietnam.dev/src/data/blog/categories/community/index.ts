import { defineBlogCategory } from '..';
import * as m from '../../locales/generated/messages';

export default defineBlogCategory((lang) => ({
	name: m['categories.community.name'](lang),
	slug: m['categories.community.slug'](lang),
	description: m['categories.community.desc'](lang),
}));
