import { mail } from '$shared/actions/mail/mail.server';
import { translations as tMail } from '$shared/actions/mail/translation';
import { LOAD_DEPENDENCIES } from '$shared/constants';
import { createMockedJobs } from '$shared/mocks';

import type { PageServerLoad, Actions } from './$types';
import { translations as tPage } from './_page/translation';

const metaTranslations = {
  vi: {
    title: 'Công việc | Svelte Vietnam',
    description: 'Công việc dành cho lập trình viên Svelte tại Việt Nam',
    keywords: ['công việc', 'việc làm', 'tuyển dụng'],
  },
  en: {
    title: 'Jobs | Svelte Vietnam',
    description: 'Job board for Svelte developers in Vietnam',
    keywords: ['code', 'conduct', 'community', 'rules'],
  },
};

export const load: PageServerLoad = ({ depends, locals: { language } }) => {
  depends(LOAD_DEPENDENCIES.LANGUAGE);
  const tMeta = metaTranslations[language];
  return {
    translations: {
      page: tPage[language],
      mail: tMail[language],
    },
    jobs: {
      fromSponsors: createMockedJobs(6),
      fromRecruitmentSites: {
        collectedAt: new Date(),
        jobs: createMockedJobs(),
      },
    },
    meta: {
      ...tMeta,
      canonical: `https://sveltevietnam.com/${language}/jobs`,
    },
  };
};

export const actions: Actions = {
  mail: (event) => mail(event, 'job'),
};
