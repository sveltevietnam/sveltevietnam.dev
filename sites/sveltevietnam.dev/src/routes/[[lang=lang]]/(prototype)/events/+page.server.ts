import { mail } from '$shared/actions/mail/mail.server';
import { translations as mailT } from '$shared/actions/mail/translation';
import { createMockedEvents } from '$shared/mocks';

import type { PageServerLoadEvent, Actions } from './$types';
import { translations as pageT } from './_page/translation';

export async function load({ parent }: PageServerLoadEvent) {
  const { language } = await parent();
  return {
    translations: {
      page: pageT[language],
      mail: mailT[language],
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