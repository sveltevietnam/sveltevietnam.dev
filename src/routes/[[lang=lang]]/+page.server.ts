import type { Language } from '$shared/services/i18n';
import { homeEn } from '$shared/services/i18n/translations/pages/home/home.en';
import { homeVi } from '$shared/services/i18n/translations/pages/home/home.vi';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
  const lang = params.lang as Language;
  const translations = {
    en: homeEn,
    vi: homeVi,
  };
  return {
    translations: translations[lang],
  };
};
