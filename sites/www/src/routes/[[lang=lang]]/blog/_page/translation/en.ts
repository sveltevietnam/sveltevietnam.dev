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
      'You may find that this blog operates a bit differently compared to other systems. Read "<a href="#" class="c-link">Behind the Screen: A Yes-code blog of Svelte Vietnam</a>" to understand the decisions behind the infrastructure design of Svelte Vietnam Blog.',
      'Tham gia <a href="https://discord.sveltevietnam.dev" target="_blank" rel="noreferrer">Discord Svelte Việt Nam</a> để thảo luận trực tiếp với cộng đồng và ban quản trị về các vấn đề xoay quanh việc viết blog. ',
      'Join <a class="c-link" href="https://discord.sveltevietnam.dev" target="_blank" rel="noreferrer">Svelte Vietnam Discord</a> to discuss directly with the community and admins about requests and issues related to writing blog posts.',
    ],
  },
  contribute: {
    title: 'How to Write',
    description:
      'Svelte Vietnam welcomes everyone to write and share their posts or link their own posts on this blog. This is the most practical and direct way that members can contribute to the community.',
    links: {
      proposePost: 'Send proposal for blog post',
      requestExternalPost: 'Send request to link external post',
      readCodeGuidelines: 'Read "Blog Post: Implementation Guidelines"',
    },
  },
  posts: {
    title: 'More Posts',
  },
  externalPosts: {
    title: 'Linked Posts',
  },
  mail: {
    description: 'Register for email notification about new blog posts',
  },
} satisfies typeof import('./vi').vi;