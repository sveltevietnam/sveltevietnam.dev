import type { BreadcrumbList, Organization, Blog, Person as StructuredPerson } from 'schema-dts';

import { SOCIAL_LINKS } from '$lib/constants';
import type { localizePerson } from '$lib/data/people';
import type { Breadcrumb } from '$lib/routing/routing.server';

export const SVELTE_VIETNAM_ORG = {
	'@type': 'Organization',
	name: 'Svelte Vietnam',
	url: 'https://sveltevietnam.dev',
	logo: {
		'@type': 'ImageObject',
		url: 'https://sveltevietnam.dev/logo/original.png',
		width: '500',
		height: '500',
	},
	sameAs: [
		SOCIAL_LINKS.GITHUB,
		SOCIAL_LINKS.TWITTER,
		SOCIAL_LINKS.FACEBOOK,
		SOCIAL_LINKS.OPEN_COLLECTIVE,
	],
} satisfies Organization;

export const SVELTE_VIETNAM_BLOG = {
	'@type': 'Blog',
	'@id': 'https://www.sveltevietnam.dev/blog',
	name: 'Svelte Vietnam Blog',
	publisher: SVELTE_VIETNAM_ORG,
} satisfies Blog;

export function buildStructuredBreadcrumbs(crumbs: Breadcrumb[]) {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: crumbs.map((crumb, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: crumb.label,
			...(crumb.href && { item: crumb.href }),
		})),
	} satisfies BreadcrumbList;
}

export function structurePerson(url: URL, person: ReturnType<typeof localizePerson>) {
	return {
		'@type': 'Person',
		name: person.name,
		...(person.title && { description: person.title }),
		...(person.link && { url: person.link }),
		...(person.avatarStaticPath && { image: `${url}/${person.avatarStaticPath}` }),
	} satisfies StructuredPerson;
}
