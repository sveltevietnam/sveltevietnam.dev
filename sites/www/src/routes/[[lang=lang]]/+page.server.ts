import { LOAD_DEPENDENCIES } from '$shared/constants';
import {
  createMockedEvents,
  createMockedJobs,
  createMockedProjects,
  createMockedSponsors,
} from '$shared/mocks';

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

export const load: PageServerLoad = async ({ depends, locals: { language } }) => {
  depends(LOAD_DEPENDENCIES.LANGUAGE);
  const tMeta = metaTranslations[language];
  return {
    events: createMockedEvents(1),
    jobs: createMockedJobs(),
    projects: createMockedProjects(4),
    sponsors: createMockedSponsors(),
    meta: {
      ...tMeta,
      canonical: `https://sveltevietnam.com/${language}`,
    },
  };
};
