import { defineBlogCategory } from '..';
import * as m from '../../locales/generated/messages';

export default defineBlogCategory((lang) => ({
	name: m['categories.svelte_kit.name'](lang),
	slug: m['categories.svelte_kit.slug'](lang),
	description: m['categories.svelte_kit.desc'](lang),
}));
