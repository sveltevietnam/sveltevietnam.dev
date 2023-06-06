import type { vi } from './vi';

export const en = {
  title: 'Jobs',
  subtitle: 'For Svelte developers, posted by sponsors and collected from some recruitment sites',
  fromSponsors: {
    title: 'From Sponsors',
    cta: 'Become a sponsor',
  },
  actions: {
    recruiter: {
      title: 'Recruiter',
      description:
        'Individuals and organizations having sponsored Svelte Vietnam may create job postings on this site.',
      cta: 'Become a sponsor',
      whyNeedSponsor: 'Why does Svelte Vietnam need sponsorship?',
    },
    candidate: {
      title: 'Candidate',
      description: 'Register to receive email notification about Svelte-related jobs',
    },
  },
  fromRecruitmentSites: {
    title: 'From Recruitment Sites',
    collectedAt: 'collected at',
  },
} satisfies typeof vi;
