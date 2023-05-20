import { createMockedContributors } from '$shared/mocks';

import type { PageServerLoadEvent } from './$types';
import { translations } from './_page/translation';

export async function load({ locals }: PageServerLoadEvent) {
  return {
    translations: {
      page: translations[locals.language],
    },
    contributors: createMockedContributors(),
  };
}
