import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals: { language } }) => {
  return {
    meta: {
      title: 'Typography | Svelte Vietnam',
      description: 'Typography Design of Svelte Vietnam',
      keywords: ['typography', 'design', 'logo'],
      canonical: `https://sveltevietnam.com/${language}/design/typography`,
    },
  };
};
