import { defineBlogSeries } from '..';
import * as m from '../../locales/generated/messages';

export default defineBlogSeries((lang) => ({
	name: m['series.behind_the_screen.name'](lang),
	slug: m['series.behind_the_screen.slug'](lang),
	description: m['series.behind_the_screen.desc'](lang),
}));
