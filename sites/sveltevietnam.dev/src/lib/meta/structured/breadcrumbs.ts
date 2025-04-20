import type { BreadcrumbList } from 'schema-dts';

import { buildStructuredTextWithLang } from './utils';

export function buildStructuredBreadcrumbs(
	lang: App.Language,
	origin: string,
	routes: { path: string; name: string }[],
): BreadcrumbList {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: routes.map((route, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			item: {
				'@id': `${origin}${route.path}`,
				name: buildStructuredTextWithLang(lang, route.name),
			},
		})),
	};
}
