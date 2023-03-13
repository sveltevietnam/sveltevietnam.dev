import { createMockedEvents, createMockedJobs, createMockedProjects } from '$shared/mocks';
import type { Language } from '$shared/services/i18n';
import { translations } from '$shared/services/i18n/translations/pages/home';

import type { PageServerLoadEvent } from './$types';

export async function load({ params }: PageServerLoadEvent) {
  const lang = params.lang as Language;
  return {
    translations: {
      page: translations[lang],
    },
    events: createMockedEvents(1),
    jobs: createMockedJobs(),
    projects: createMockedProjects(1),
    sponsors: [],
  };
}
