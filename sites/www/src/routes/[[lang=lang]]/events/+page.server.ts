import { superValidate } from 'sveltekit-superforms/server';

import { mailSchema } from '$client/components/MailRegistrationForm';
import { mail } from '$server/actions/mail/mail.server';
import { translations as mailT } from '$server/actions/mail/translation';
import { LOAD_DEPENDENCIES } from '$shared/constants';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

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

export const load: PageServerLoad = async ({ url, depends, locals: { language } }) => {
  depends(LOAD_DEPENDENCIES.LANGUAGE);
  const tMeta = metaTranslations[language];
  const mailForm = await superValidate(mailSchema);
  return {
    breadcrumbs: buildBreadcrumbs(url.pathname),
    translations: {
      page: pageT[language],
      mail: mailT[language],
    },
    events: {
      upcoming: [],
      past: [],
    },
    meta: {
      ...tMeta,
      canonical: `https://sveltevietnam.dev/${language}/events`,
    },
    mailForm,
  };
};

export const actions: Actions = {
  mail: async (event) => mail(event, 'event'),
};
