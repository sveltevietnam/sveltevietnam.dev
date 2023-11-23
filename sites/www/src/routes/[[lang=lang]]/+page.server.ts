import type { WithContext, Organization } from 'schema-dts';

import { LOAD_DEPENDENCIES } from '$shared/constants';
import { SVELTE_VIETNAM_ORG } from '$shared/data/structured';
import type { Language } from '$shared/services/i18n';
import { ROOT_URL } from '$shared/services/navigation';

import type { PageServerLoad } from './$types';
import { EXTERNAL_POSTS, INTERNAL_POSTS } from './blog/_page/data';

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
	return {
		events: [],
		// events: createMockedEvents(4),
		posts: {
			internal: INTERNAL_POSTS.slice(0, 3),
			external: EXTERNAL_POSTS.at(0),
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
