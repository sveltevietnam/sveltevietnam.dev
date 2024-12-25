import type { Organization, Blog } from 'schema-dts';

import { SOCIAL_LINKS } from '$data/links';

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
		SOCIAL_LINKS.BLUESKY,
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

