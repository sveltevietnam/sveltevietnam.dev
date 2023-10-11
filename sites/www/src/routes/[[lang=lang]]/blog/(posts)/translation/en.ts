import { SOCIAL_LINKS } from '$shared/constants';

export const en = {
  urlCopyNotice: 'Blog post was saved to clipboard',
  unsupportedLanguage: `The blog is displayed in its default language as translation has not been provided yet. If possible, please join <a href="${SOCIAL_LINKS.github}" class="c-link" target="_blank" rel="noreferrer">Github</a> and <a href="${SOCIAL_LINKS.discord}" class="c-link" target="_blank" rel="noreferrer">Discord</a> to help with translation. Thank you!`,
  readMinutes: 'min read',
  tableOfContents: {
    title: 'Table of Contents',
    linkLabelToTitle: 'Title',
  },
  share: 'Share',
  editLink: {
    intro: 'Found a typo or need correction?',
    label: 'Edit this page on Github',
  },
} satisfies typeof import('./vi').vi;
