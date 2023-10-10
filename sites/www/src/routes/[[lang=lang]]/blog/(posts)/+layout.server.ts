import { superValidate } from 'sveltekit-superforms/client';

import { mailSchema } from '$client/components/MailRegistrationForm';
import { translations as mailT } from '$server/actions/mail/translation';
import { LOAD_DEPENDENCIES } from '$shared/constants';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { LayoutServerLoad } from './$types';
import { translations } from './translation';

export const load: LayoutServerLoad = async ({ url, depends, locals: { language } }) => {
  depends(LOAD_DEPENDENCIES.LANGUAGE);
  const mailForm = await superValidate(mailSchema);
  return {
    breadcrumbs: buildBreadcrumbs(url.pathname),
    translations: {
      layout: translations[language],
      mail: mailT[language],
    },
    mailForm,
  };
};
