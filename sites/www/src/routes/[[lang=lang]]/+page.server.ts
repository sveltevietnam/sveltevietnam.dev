import type { WithContext, Organization } from 'schema-dts';

import { LOAD_DEPENDENCIES } from '$shared/constants';
import { SVELTE_VIETNAM_ORG } from '$shared/data/structured';
import type { Language } from '$shared/services/i18n';
import { ROADMAP_PATH, ROOT_URL } from '$shared/services/navigation';

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

const UNDER_CONSTRUCTION_NOTE = {
	vi: `Trang Svelte Việt Nam vẫn đang trong giai đoạn phát triển. Dữ liệu hiển thị dưới đây chỉ để làm mẫu. Trong thời gian này bạn hãy tham gia <a href="${SOCIAL_LINKS.DISCORD}" target="_blank" class="c-link" rel="noreferrer">discord của cộng đồng</a> hoặc xem <a class="c-link" href=${ROADMAP_PATH}>Lộ trình</a>.`,
	en: `The Svelte Vietnam site is still active development. The data shown below is for mocking only. In the meantime, have a chat with us at <a href="${SOCIAL_LINKS.DISCORD}" target="_blank" class="c-link" rel="noreferrer">our discord</a> or see the <a class="c-link" href=${ROADMAP_PATH}>Roadmap</a>.`,
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
		underConstructionNote: UNDER_CONSTRUCTION_NOTE[language],
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
