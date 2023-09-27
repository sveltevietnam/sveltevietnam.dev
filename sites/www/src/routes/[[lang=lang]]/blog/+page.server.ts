import { superValidate } from 'sveltekit-superforms/client';

import { mailSchema } from '$client/components/MailRegistrationForm';
import { mail } from '$server/actions/mail/mail.server';
import { translations as mailT } from '$server/actions/mail/translation';
import { LOAD_DEPENDENCIES } from '$shared/constants';
import { createMockedExternalPost, createMockedPost } from '$shared/mocks';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { Actions, PageServerLoad } from './$types';
import { translations as pageT } from './_page/translation';

const metaTranslations = {
  vi: {
    title: 'Blog | Svelte Việt Nam',
    description: '',
    keywords: ['blog', 'viết', 'chia sẻ', 'cộng đồng', 'tham gia', 'đóng góp'],
  },
  en: {
    title: 'Blog | Svelte Vietnam',
    description: '',
    keywords: ['blog', 'writing', 'sharing', 'community', 'involvement', 'contribution'],
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
    meta: {
      ...tMeta,
      canonical: `https://sveltevietnam.dev/${language}/blog`,
    },
    posts: {
      internal: createMockedPost(0),
      external: createMockedExternalPost(0),
    },
    mailForm,
  };
};

export const actions: Actions = {
  mail: async (event) => mail(event, 'blog'),
};
