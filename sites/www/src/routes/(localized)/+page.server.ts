import type { WithContext, Organization } from 'schema-dts';

import { LOAD_DEPENDENCIES } from '$lib/constants';
import { EXTERNAL_POSTS, INTERNAL_POSTS, localizeExternalPost, localizePost } from '$lib/data/blog';
import { listEvents } from '$lib/data/events';
import { SVELTE_VIETNAM_ORG } from '$lib/data/structured';
import { prepareRoutePageData } from '$lib/routing/routing.server';

import type { PageServerLoad } from './$types';

const metaTranslations: Record<App.Language, App.PageData['meta']> = {
	vi: {
		title: 'Trang chủ | Svelte Việt Nam',
		description: 'Cộng đồng và trung tâm thông tin cho Svelte tại Việt Nam',
		keywords: ['công nghệ', 'thông tin', 'cộng đồng', 'dự án', 'tác động', 'việc làm', 'sự kiện'],
	},
	en: {
		title: 'Home | Svelte Vietnam',
		description: 'Community and go-to information hub for people of Svelte in Vietnam',
		keywords: ['technology', 'information', 'community', 'project', 'impact', 'job', 'event'],
	},
};

export const load: PageServerLoad = ({ depends, locals }) => {
	const lang = locals.settings.language;
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const tMeta = metaTranslations[lang];

	const events = listEvents(lang);
	return {
		route: prepareRoutePageData(lang, 'home'),
		events: [...events.upcoming, ...events.ongoing],
		posts: {
			internal: INTERNAL_POSTS.slice(0, 3).map((post) => localizePost(lang, post)),
			external: EXTERNAL_POSTS.slice(0, 1)
				.map((post) => localizeExternalPost(lang, post))
				.at(0),
		},
		jobs: [],
		projects: [],
		meta: {
			...tMeta,
			structured: JSON.stringify({
				'@context': 'https://schema.org',
				...SVELTE_VIETNAM_ORG,
			} satisfies WithContext<Organization>),
		},
	};
};
