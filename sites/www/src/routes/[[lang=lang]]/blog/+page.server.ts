import type { WithContext, Blog } from 'schema-dts';

import { mail } from '$server/actions/mail/mail.server';
import ogImage from '$shared/assets/images/og/og-blog.jpg';
import { LOAD_DEPENDENCIES } from '$shared/constants';
import { SVELTE_VIETNAM_BLOG } from '$shared/data/structured';
import type { Language } from '$shared/services/i18n';
import { BLOG_PATH, ROOT_URL } from '$shared/services/navigation';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { Actions, PageServerLoad } from './$types';
import { INTERNAL_POSTS, EXTERNAL_POSTS } from './_page/data';
import { translations as pageT } from './_page/translation';

const metaTranslations: Record<Language, App.PageData['meta']> = {
	vi: {
		title: 'Blog | Svelte Việt Nam',
		description:
			'Nơi để mọi người cùng viết và chia sẻ kinh nghiệm và kiến thức về hệ sinh thái và cộng đồng Svelte',
		keywords: ['blog', 'viết', 'chia sẻ', 'cộng đồng', 'tham gia', 'đóng góp'],
	},
	en: {
		title: 'Blog | Svelte Vietnam',
		description:
			'A place for everyone to write, share experience and knowledge about Svelte, its ecosystem and community',
		keywords: ['blog', 'writing', 'sharing', 'community', 'involvement', 'contribution'],
	},
};

const issueTemplateLinks = {
	vi: {
		proposePost:
			'https://github.com/sveltevietnam/sveltevietnam.dev/issues/new?assignees=vnphanquang&labels=page%3Ablog%2Ccontent%3Ablog%2Cblog%3Apending&projects=&template=vi_blog_post_proposal.yaml&title=%C4%90%E1%BB%81+ngh%E1%BB%8B+%C4%91%C4%83ng+b%C3%A0i%3A+%3Ct%E1%BB%B1a+%C4%91%E1%BB%81+b%C3%A0i+vi%E1%BA%BFt%3E',
		requestExternalPost:
			'https://github.com/sveltevietnam/sveltevietnam.dev/issues/new?assignees=vnphanquang&labels=page%3Ablog%2Ccontent%3Ablog&projects=&template=vi_external_blog_post_link_request.yaml&title=Li%C3%AAn+k%E1%BA%BFt+b%C3%A0i+vi%E1%BA%BFt+ngo%C3%A0i%3A+%3Ct%E1%BB%B1a+%C4%91%E1%BB%81+b%C3%A0i+vi%E1%BA%BFt%3E',
	},
	en: {
		proposePost:
			'https://github.com/sveltevietnam/sveltevietnam.dev/issues/new?assignees=vnphanquang&labels=page%3Ablog%2Ccontent%3Ablog%2Cblog%3Apending&projects=&template=en_blog_post_proposal.yaml&title=Blog+Post+Proposal%3A+%3Cshort+title+of+blog+post%3E',
		requestExternalPost:
			'https://github.com/sveltevietnam/sveltevietnam.dev/issues/new?assignees=vnphanquang&labels=page%3Ablog%2Ccontent%3Ablog&projects=&template=en_external_blog_post_link_request.yaml&title=External+Blog+Post+Link+Request%3A+%3Cshort+title+of+blog+post%3E',
	},
} as const;

export const load: PageServerLoad = async ({ url, depends, locals: { language } }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const tMeta = metaTranslations[language];
	return {
		breadcrumbs: buildBreadcrumbs(url.pathname),
		translations: {
			page: pageT[language],
		},
		issueTemplateLinks: issueTemplateLinks[language],
		meta: {
			...tMeta,
			canonical: `${ROOT_URL}/${language}${BLOG_PATH}`,
			og: {
				image: ogImage,
			},
			structured: JSON.stringify({
				'@context': 'https://schema.org',
				...SVELTE_VIETNAM_BLOG,
			} as WithContext<Blog>),
		},
		posts: {
			internal: INTERNAL_POSTS,
			external: EXTERNAL_POSTS,
		},
	};
};

export const actions: Actions = {
	mail: async (event) => mail(event, 'blog'),
};
