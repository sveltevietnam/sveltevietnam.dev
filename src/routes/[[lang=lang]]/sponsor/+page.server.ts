import type { Language } from '$shared/services/i18n';
import { translations } from '$shared/services/i18n/translations/pages/sponsor';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const lang = params.lang as Language;
  return {
    translations: {
      page: translations[lang],
    },
  };
};
