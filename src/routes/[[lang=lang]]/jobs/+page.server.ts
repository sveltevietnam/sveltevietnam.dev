import { mail } from '$shared/actions/mail/mail.server';
import { translations as tMail } from '$shared/actions/mail/translation';
import { createMockedJobs } from '$shared/mocks';
import type { Language } from '$shared/services/i18n';
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
