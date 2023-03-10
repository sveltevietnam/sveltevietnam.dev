import { mail } from '$server/actions/mail';
import { createMockedEvents } from '$shared/mocks';
import type { Language } from '$shared/services/i18n';
import { translations as mailT } from '$shared/services/i18n/translations/actions/mail';
import { translations as pageT } from '$shared/services/i18n/translations/pages/events';

import type { PageServerLoadEvent, Actions } from './$types';

export async function load({ params }: PageServerLoadEvent) {
  const lang = params.lang as Language;
  return {
    translations: {
      page: pageT[lang],
      mail: mailT[lang],
    },
    events: {
      upcoming: createMockedEvents(1),
      past: createMockedEvents(4),
    },
  };
}

export const actions: Actions = {
  mail: async (event) => mail(event, 'event'),
};
