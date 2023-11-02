import { EMAILS } from '$shared/constants';

export const en = {
  title: 'Positive Impact',
  subtitle: 'Technology for all',
  description:
    'The efficiency and flexibility of Svelte and complementary technologies in its ecosystem is a crucial element in facilitating projects with limited resources and unique challenges. With these toolings at hand, the Svelte and open source community can work collectively to create positive impacts to society and the environment.<br/><br/>If you are working in projects that are for the common good (nonprofit, environmental, social, ...) and need discussion or technical consultation, reach out through one of the following communication channels.',
  ctas: {
    github: 'Share <strong>publicly</strong> at Github',
    discord: 'Share at Discord',
    email: `Email <em>${EMAILS.IMPACT}</em>`,
  },
  projectsInNeed: {
    title: 'Projects in Need',
  },
  projectsLaunched: {
    title: 'Launched Projects',
  },
} satisfies typeof import('./vi').vi;
