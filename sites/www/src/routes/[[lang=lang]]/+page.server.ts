import type { WithContext, Organization } from 'schema-dts';

import { LOAD_DEPENDENCIES } from '$shared/constants';
import {
	EXTERNAL_POSTS,
	INTERNAL_POSTS,
	localizeExternalPost,
	localizePost,
} from '$shared/data/blog';
import { listEvents } from '$shared/data/events';
import { SVELTE_VIETNAM_ORG } from '$shared/data/structured';
import type { Language } from '$shared/services/i18n';
import { ROOT_URL } from '$shared/services/navigation';

import type { PageServerLoad } from './$types';

const metaTranslations: Record<Language, App.PageData['meta']> = {
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

export const load: PageServerLoad = async ({ depends, locals: { language } }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const tMeta = metaTranslations[language];

	const events = listEvents(language);
	return {
		events: [...events.upcoming, ...events.ongoing],
		posts: {
			internal: INTERNAL_POSTS.slice(0, 3).map((post) => localizePost(language, post)),
			external: EXTERNAL_POSTS.slice(0, 1)
				.map((post) => localizeExternalPost(language, post))
				.at(0),
		},
		jobs: [],
		projects: [],
		sponsors: [],
		meta: {
			...tMeta,
			canonical: `${ROOT_URL}/${language}`,
			structured: JSON.stringify({
				'@context': 'https://schema.org',
				...SVELTE_VIETNAM_ORG,
			} satisfies WithContext<Organization>),
		},
	};
};
