import { mail } from '$shared/actions/mail/mail.server';
import { translations as tMail } from '$shared/actions/mail/translation';
import { createMockedJobs } from '$shared/mocks';

import type { PageServerLoadEvent, Actions } from './$types';
import { translations as tPage } from './_page/translation';

export async function load({ parent }: PageServerLoadEvent) {
  const { language } = await parent();
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
  };
}

export const actions: Actions = {
  mail: (event) => mail(event, 'job'),
};