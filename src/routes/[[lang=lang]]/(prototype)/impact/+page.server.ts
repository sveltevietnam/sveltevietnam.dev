import { createMockedProjects } from '$shared/mocks';

import type { PageServerLoadEvent } from './$types';
import { translations } from './_page/translation';

export async function load({ parent }: PageServerLoadEvent) {
  const { language } = await parent();
  return {
    translations: {
      page: translations[language],
    },
    projects: {
      inNeed: createMockedProjects(2),
      launched: createMockedProjects(2),
    },
  };
}
