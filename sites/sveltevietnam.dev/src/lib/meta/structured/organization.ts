import type { Organization } from 'schema-dts';

import { EMAILS } from '$data/emails';
import { SOCIAL_LINKS } from '$data/links';

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

export function buildStructuredOrganization(
	lang: App.Language,
	origin: string,
): Organization & { '@id': string } {
	const locale = locales[lang];
	return {
		'@type': 'Organization',
		'@id': origin,
		url: buildStructuredTextWithLang(lang, `${origin}/${lang}`),
		name: 'Svelte Việt Nam',
		alternateName: 'Svelte Vietnam',
		description: buildStructuredTextWithLang(lang, locale.description),
		logo: {
			'@type': 'ImageObject',
			url: `${origin}/logo/original.png`,
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
