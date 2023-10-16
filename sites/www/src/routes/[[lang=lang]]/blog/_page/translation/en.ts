import { EMAILS, SOCIAL_LINKS } from '$shared/constants';

export const en = {
  title: 'Blog',
  subtitle: 'Learn to share. Sharing is learning',
  recent: {
    title: 'Most recent posts',
  },
  introduction: {
    title: 'Introduction',
    description: [
      'This is where Svelte Vietnam community members share and spread knowledge, ideas, and their experience in Svelte and open source communities around the world.',
      'You may find that this blog operates a bit differently compared to other systems. Read "<a href="#" class="c-link">Behind the Screen: A Yes-code Blog of Svelte Vietnam</a>" to understand the decisions behind its infrastructure design.',
      'Join <a class="c-link" href="https://discord.sveltevietnam.dev" target="_blank" rel="noreferrer">Svelte Vietnam Discord</a> to discuss directly with the community and admins about requests and issues related to writing blog posts.',
    ],
  },
  contribute: {
    title: 'How to Write',
    description:
      'Svelte Vietnam welcomes everyone to write and share their posts or link their own posts on this blog. This is the most practical and direct way that members can contribute to the community.',
    links: {
      proposePost: 'Submit a proposal for blog post (Github issue)',
      requestExternalPost: 'Submit a request to link external post (Github issue)',
      readCodeGuidelines: 'Read "Blog Post: Implementation Guidelines"',
    },
    contact: `If you do not use Github, contact administrators via <a class="c-link" href="${SOCIAL_LINKS.discord}" target="_blank" rel="noreferrer">Discord</a> or <a class="c-link" href="mailto:${EMAILS.blog}" target="_blank" rel="noreferrer">${EMAILS.blog}</a>.`,
  },
  posts: {
    title: 'Other Posts',
    tba: {
      description: 'No other post is available yet',
      cta: 'Propose your blog post',
    },
  },
  externalPosts: {
    title: 'Links',
    tba: {
      description: 'No link is available yet',
      cta: 'Request to link yours',
    },
  },
  mail: {
    description: 'Register for email notification about new blog posts',
  },
} satisfies typeof import('./vi').vi;
