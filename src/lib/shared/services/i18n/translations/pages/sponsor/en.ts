import { EMAILS } from '$shared/constants';

import type { vi } from './vi';

export const en = {
  title: 'Sponsor',
  intro:
    'Svelte Vietnam chooses <a class="c-link font-bold" href="https://docs.opencollective.com/help/about/introduction" target="_blank" rel="noreferrer">Open Collective</a> to receive financial contributions from sponsors (individuals or organizations) thanks to its great support for open source and the transparency it provides: all donations and expenses are recorded and public to everyone.',
  ctas: {
    sponsor: 'Sponsor through Open Collective',
    question: `Send questions to <em>${EMAILS.sponsor}</em>`,
  },
  why: {
    title: 'Why does Svelte Vietnam need sponsorship?',
    description:
      'Svelte Vietnam is made possible by a collective effort from many individuals: maintaining infrastructure and site content, organizing events, helping others in forums, contributing to open source and nonprofit projects, ... Many of these people have their own full-time job and family. Financial sponsorship will help reduce unavoidable costs and create an incentive to sustain this valuable effort.<br/><br/>Apart from financial donation, individuals and organizations can support in organizing events, providing space for meetups, and spreading not only the adoption of Svelte, but also the open source mindset and sharing habit within the technology community in Vietnam.',
  },
  sponsors: {
    cta: 'See list of sponsors and financial report at Open Collective',
  },
} satisfies typeof vi;
