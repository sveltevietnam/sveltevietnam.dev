import { defineBlogCategory } from '..';
import * as m from '../../locales/generated/messages';

export default defineBlogCategory((lang) => ({
	name: m['categories.insider.name'](lang),
	slug: m['categories.insider.slug'](lang),
	description: m['categories.insider.desc'](lang),
}));
