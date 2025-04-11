import { defineBlogSeries } from '..';
import * as m from '../../locales/generated/messages';

export default defineBlogSeries((lang) => ({
	name: m['series.styling_svelte_vietnam.name'](lang),
	slug: m['series.styling_svelte_vietnam.slug'](lang),
	description: m['series.styling_svelte_vietnam.desc'](lang),
}));

