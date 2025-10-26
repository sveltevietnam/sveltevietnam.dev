import type { Language } from '@sveltevietnam/kit/constants';
import { EMAILS, SOCIAL_LINKS } from '@sveltevietnam/kit/constants';
import { buildStructuredTextWithLang } from '@sveltevietnam/kit/utilities/structured-data';
import type { Organization } from 'schema-dts';

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
	lang: Language,
	origin: string,
): Organization & { '@id': string } {
	const locale = locales[lang];
	return {
		'@type': 'Organization',
		'@id': origin,
		url: buildStructuredTextWithLang({ lang, value: `${origin}/${lang}` }),
		name: 'Svelte Việt Nam',
		alternateName: 'Svelte Vietnam',
		description: buildStructuredTextWithLang({ lang, value: locale.description }),
		logo: {
			'@type': 'ImageObject',
			url: `${origin}/logo/original.png`,
			width: '500',
			height: '500',
		},
		contactPoint: {
			'@type': 'ContactPoint',
			email: EMAILS.CONTACT,
			contactType: buildStructuredTextWithLang({ lang, value: locale.contactPointType }),
		},
		sameAs: [
			SOCIAL_LINKS.GITHUB,
			SOCIAL_LINKS.BLUESKY,
			SOCIAL_LINKS.FACEBOOK,
			SOCIAL_LINKS.OPEN_COLLECTIVE,
		],
	};
}
