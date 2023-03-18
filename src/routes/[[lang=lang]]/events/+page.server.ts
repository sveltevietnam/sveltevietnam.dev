import { mail } from '$shared/actions/mail/mail.server';
import { translations as mailT } from '$shared/actions/mail/translation';
import { createMockedEvents } from '$shared/mocks';
import type { Language } from '$shared/services/i18n';

import type { PageServerLoadEvent, Actions } from './$types';
import { translations as pageT } from './_page/translation';

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
