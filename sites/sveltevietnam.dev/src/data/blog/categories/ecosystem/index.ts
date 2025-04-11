import { defineBlogCategory } from '..';
import * as m from '../../locales/generated/messages';

export default defineBlogCategory((lang) => ({
	name: m['categories.ecosystem.name'](lang),
	slug: m['categories.ecosystem.slug'](lang),
	description: m['categories.ecosystem.desc'](lang),
}));
