import type { Thing, WithContext, BreadcrumbList } from 'schema-dts';

export function withContext<T extends Thing>(data: T) {
	return {
		'@context': 'https://schema.org',
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		...(data as any)
	} satisfies WithContext<T>;
}

export function toStringWithContext<T extends Thing>(data: T | T[]): string {
	if (Array.isArray(data)) {
		return JSON.stringify(data.map(withContext));
	}
	return JSON.stringify(withContext(data));
}

export function buildStructuredBreadcrumbs(origin: string, routes: App.Route[]): BreadcrumbList {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: routes.map((route, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			item: {
				'@id': `${origin}${route.path}`,
				name: route.name,
			},
		})),
	}
}
