import type { PageServerLoadEvent } from './$types';
import { translations } from './_page/translation';

export async function load({ parent }: PageServerLoadEvent) {
  const { language } = await parent();
  return {
    translations: {
      page: translations[language],
    },
  };
}
