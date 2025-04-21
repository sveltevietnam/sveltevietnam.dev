import type { Organization } from 'schema-dts';

import { EMAILS } from '$data/emails';
import { SOCIAL_LINKS } from '$data/links';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';

import { buildStructuredTextWithLang } from './utils';

// TODO: extract to locale YAML files
const locales = {
	vi: {
		description:
			'Kênh thông tin tổng hợp và cộng đồng dành cho bất cứ ai quan tâm đến sự phát triển của Svelte tại Việt Nam.',
		contactPointType: 'liên hệ chung',
	},
	en: {
		description: 'An inclusive community and go-to information hub for people of Svelte in Vietnam',
		contactPointType: 'general inquiries',
	},
};

export function buildStructuredOrganization(lang: App.Language): Organization & { '@id': string } {
	const locale = locales[lang];
	return {
		'@type': 'Organization',
		'@id': VITE_PUBLIC_ORIGIN,
		url: buildStructuredTextWithLang(lang, `${VITE_PUBLIC_ORIGIN}/${lang}`),
		name: 'Svelte Việt Nam',
		alternateName: 'Svelte Vietnam',
		description: buildStructuredTextWithLang(lang, locale.description),
		logo: {
			'@type': 'ImageObject',
			url: `${VITE_PUBLIC_ORIGIN}/logo/original.png`,
			width: '500',
			height: '500',
		},
		contactPoint: {
			'@type': 'ContactPoint',
			email: EMAILS.CONTACT,
			contactType: buildStructuredTextWithLang(lang, locale.contactPointType),
		},
		sameAs: [
			SOCIAL_LINKS.GITHUB,
			SOCIAL_LINKS.BLUESKY,
			SOCIAL_LINKS.FACEBOOK,
			SOCIAL_LINKS.OPEN_COLLECTIVE,
		],
	};
}
