import type { Organization } from 'schema-dts';

import { SOCIAL_LINKS } from '$shared/constants';

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
