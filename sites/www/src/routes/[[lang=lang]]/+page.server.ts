import { LOAD_DEPENDENCIES, SOCIAL_LINKS } from '$shared/constants';
import { createMockedJobs, createMockedProjects, createMockedSponsors } from '$shared/mocks';

import type { PageServerLoad } from './$types';

const metaTranslations = {
  vi: {
    title: 'Trang chủ | Svelte Vietnam',
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
  vi: `Trang Svelte Vietnam vẫn đang trong giai đoạn phát triển. Dữ liệu hiển thị dưới đây chỉ để làm mẫu. Trong thời gian này bạn hãy tham gia <a href="${SOCIAL_LINKS.discord}" target="_blank" class="c-link" rel="noreferrer">discord của cộng đồng</a> nhé!`,
  en: `The Svelte Vietnam site is still active development. The data shown below is for mocking only. In the meantime, have a chat with us at <a href="${SOCIAL_LINKS.discord}" target="_blank" class="c-link" rel="noreferrer">our discord</a>.`,
};

export const load: PageServerLoad = async ({ depends, locals: { language } }) => {
  depends(LOAD_DEPENDENCIES.LANGUAGE);
  const tMeta = metaTranslations[language];
  return {
    events: [],
    jobs: createMockedJobs(),
    projects: createMockedProjects(4),
    sponsors: createMockedSponsors(),
    underConstructionNote: UNDER_CONSTRUCTION_NOTE[language],
    meta: {
      ...tMeta,
      canonical: `https://sveltevietnam.dev/${language}`,
    },
  };
};
