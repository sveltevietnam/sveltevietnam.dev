import { SOCIAL_LINKS } from '$shared/constants';

export const en = {
  intro: {
    title: 'Introduction',
    svelte:
      'A web technology for building user interface that enables great end-user experience without trading off developer productivity',
    vietnam:
      'A technology hub with engaging developers and rapidly growing investment in sustainable technologies and digital transformation',
    sveltevietnam:
      'A go-to and one-stop information center, and an inclusive community for anyone interested in the adoption of Svelte in Vietnam',
  },
  community: {
    title: 'Community',
    description: `Join the <a class="c-link" href=${SOCIAL_LINKS.discord} target="_blank" rel="noreferrer">Svelte Vietnam Discord</a> and start having conversations, help or seek help from other members.<br>To contribute to the source code of this website or other open source projects from Svelte Vietnam, visit the <a class="c-link" href="${SOCIAL_LINKS.github}" target="_blank" rel="noreferrer">Svelte Vietnam Github</a> page.`,
    ctas: {
      discord: 'Join now at Discord',
      nominate: 'Nominate contributor',
      contribute: 'Contribute at Github',
    },
  },
  events: {
    title: 'Next Event',
    description: 'Join the community to share your experience, products, and all thing Svelte',
    tba: {
      description: 'No event is planned yet.',
      cta: 'Register for notification about the next event.',
    },
  },
  jobs: {
    title: 'Recent Jobs',
    description: 'Share or apply for Svelte-related jobs or collaboration opportunities',
  },
  impact: {
    title: 'Projects',
    description: 'Share or participate in open source or non-profit projects and make a difference',
    by: 'By',
  },
  sponsor: {
    title: 'Sponsors',
    description: 'Help sustain the community and support its growth by becoming a sponsor',
  },
} satisfies typeof import('./vi').vi;
