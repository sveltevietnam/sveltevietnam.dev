import { EMAILS } from '$shared/constants';

import type { vi } from './vi';

export const en = {
  title: 'Code of Conduct',
  notice: {
    description:
      'All members (individuals and organizations) participating in the Svelte Vietnam community must follow the “Code of Conduct” of <a href="https://github.com/sveltejs/community/blob/main/CODE_OF_CONDUCT.md" target="_blank" rel="noreferrer" class="c-link">sveltejs/community</a> and <a href="https://sveltesociety.dev/about" target="_blank" rel="noreferrer" class="c-link">Svelte Society</a>.',
    action:
      'For reports, feedback, and questions, please reach out through the following channels. Thank you!',
    ctas: {
      discord: 'Contact moderator at dicsord',
      email: `Email <em>${EMAILS.coc}</em>`,
    },
  },
  excerpt: {
    intro: 'Shown below is an excerpt from the Code of Conduct of Svelte Society.',
    quote:
      'Svelte Society is dedicated to providing <strong/>a harassment-free community for everyone</strong>, regardless of sex, gender identity or expression, sexual orientation, disability, physical appearance, age, race, nationality, or religious beliefs. <strong>We do not tolerate harassment of community members in any form</strong>. Participants violating these rules may be sanctioned or expelled from the community at the discretion of Svelte Society organizers.<br/><br/>All attendees, speakers, sponsors, instructors, and volunteers at our events are required to agree with the following code of conduct. Leadership will enforce this code at all times. We expect cooperation from all participants to help ensure a safe environment for everybody.',
    caption: 'Svelte Society, <cite class="font-bold">TL;DR - Code of Conduct</cite>',
  },
} satisfies typeof vi;
