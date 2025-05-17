import { loadBlogPost } from '$data/blog/posts';
import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/images/og-design.en.jpg?url';
import ogImageVi from './_page/images/og-design.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;
	return {
		sampleBlogPost: (await loadBlogPost(
			'20250425-mini-snippet-reactive-extension-storage-wxt',
			lang,
		))!,
		routing: {
			breadcrumbs: b['/:lang/design']({ lang }),
			paths: {
				vi: p['/:lang/design']({ lang: 'vi' }),
				en: p['/:lang/design']({ lang: 'en' }),
			},
		},
		meta: {
			title: m['pages.design.title'](lang),
			description: m['pages.design.desc'](lang),
			keywords: m['pages.design.keywords'](lang),
			og: {
				image: ogImage[lang],
			},
		},
	};
};
