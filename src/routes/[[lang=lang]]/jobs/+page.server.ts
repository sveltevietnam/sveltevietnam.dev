import { mail } from '$server/actions/mail';
import { createMockedJobs } from '$shared/mocks';
import type { Language } from '$shared/services/i18n';
import { translations as tMail } from '$shared/services/i18n/translations/actions/mail';
import { translations as tPage } from '$shared/services/i18n/translations/pages/jobs';

import type { PageServerLoadEvent, Actions } from './$types';

export async function load({ params }: PageServerLoadEvent) {
  const lang = params.lang as Language;
  return {
    translations: {
      page: tPage[lang],
      mail: tMail[lang],
    },
    jobs: {
      fromSponsors: createMockedJobs(true, 2),
      fromRecruitmentSites: {
        collectedAt: new Date(),
        jobs: createMockedJobs(),
      },
    },
  };
}

export const actions: Actions = {
  mail: (event) => mail(event, 'job'),
};
