import { createMockedProjects } from '$shared/mocks';

import type { PageServerLoadEvent } from './$types';
import { translations } from './_page/translation';

export async function load({ locals }: PageServerLoadEvent) {
  return {
    translations: {
      page: translations[locals.language],
    },
    projects: {
      inNeed: createMockedProjects(2),
      launched: createMockedProjects(2),
    },
  };
}
