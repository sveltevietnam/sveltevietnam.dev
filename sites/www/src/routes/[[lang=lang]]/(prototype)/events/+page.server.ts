import { mail } from '$shared/actions/mail/mail.server';
import { translations as mailT } from '$shared/actions/mail/translation';
import { LOAD_DEPENDENCIES } from '$shared/constants';
import { createMockedEvents } from '$shared/mocks';

import type { PageServerLoad, Actions } from './$types';
import { translations as pageT } from './_page/translation';

const metaTranslations = {
  vi: {
    title: 'Sự kiện | Svelte Vietnam',
    description: 'Gặp gỡ cộng đồng Svelte tại Việt Nam',
    keywords: ['sự kiện', 'cộng đồng', 'gặp mặt'],
  },
  en: {
    title: 'Events | Svelte Vietnam',
    description: 'Meet up with people of Svelte in Vietnam',
    keywords: ['event', 'community', 'meetup'],
  },
};

export const load: PageServerLoad = ({ depends, locals: { language } }) => {
  depends(LOAD_DEPENDENCIES.LANGUAGE);
  const tMeta = metaTranslations[language];
  return {
    translations: {
      page: pageT[language],
      mail: mailT[language],
    },
    events: {
      upcoming: createMockedEvents(1),
      past: createMockedEvents(4),
    },
    meta: {
      ...tMeta,
      canonical: `https://sveltevietnam.com/${language}/events`,
    },
  };
};

export const actions: Actions = {
  mail: async (event) => mail(event, 'event'),
};
