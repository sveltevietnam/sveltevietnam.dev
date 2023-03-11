import { EMAILS } from '$shared/constants';

import type { vi } from './vi';

export const en = {
  title: 'Events',
  subtitle: 'Meetups, conferences about Svelte and open source',
  upcomingEvents: {
    title: 'Upcoming Events',
  },
  actions: {
    share: {
      title: 'Share',
      description:
        'Register to be speaker at the next meetups to share your experience and products',
      cta: `Email <em>${EMAILS.events}</em>`,
    },
    participate: {
      title: 'Participate',
      description: 'Register to receive email notification about upcoming Svelte Vietnam meetups',
    },
    discord: {
      cta: 'Join the community now in Discord',
    },
    sponsor: {
      title: 'Sponsor',
      description:
        'Become a sponsor of Svelte Vietnam to promote their teams, introduce their brands and products, and strengthen relationship with the open source community.',
      cta: 'Become a sponsor',
      whyNeedSponsor: 'Why does Svelte Vietnam need sponsorship?',
    },
  },
  pastEvents: {
    title: 'Past Events',
  },
} satisfies typeof vi;
