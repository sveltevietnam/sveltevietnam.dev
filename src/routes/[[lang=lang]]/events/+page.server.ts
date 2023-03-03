import { createMockedEvents } from '$shared/mocks';
import type { Language } from '$shared/services/i18n';
import { translations } from '$shared/services/i18n/translations/pages/events';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const lang = params.lang as Language;
  return {
    translations: {
      page: translations[lang],
    },
    events: {
      upcoming: createMockedEvents(1),
      past: createMockedEvents(4),
    },
  };
};
