import type { Language } from '$shared/services/i18n';
import { translations } from '$shared/services/i18n/translations/pages/sponsor';

import type { PageServerLoadEvent } from './$types';

export async function load({ params }: PageServerLoadEvent) {
  const lang = params.lang as Language;
  return {
    translations: {
      page: translations[lang],
    },
  };
}
