import { createMockedProjects } from '$shared/mocks';
import type { Language } from '$shared/services/i18n';

import type { PageServerLoadEvent } from './$types';
import { translations } from './_page/translation';

export async function load({ params }: PageServerLoadEvent) {
  const lang = params.lang as Language;
  return {
    translations: {
      page: translations[lang],
    },
    projects: {
      inNeed: createMockedProjects(2),
      launched: createMockedProjects(2),
    },
  };
}
