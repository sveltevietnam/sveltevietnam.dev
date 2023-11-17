import { SOCIAL_LINKS } from '$shared/constants';

export const en = {
	urlCopyNotice: 'Blog post was saved to clipboard',
	language: {
		original: {
			label: 'Original language',
			description: 'You are reading the blog post in its original language.',
		},
		translated: {
			label: 'Manual translation',
			description: 'You are reading a manual translation of the blog post.',
		},
		unsupported: `The blog post is displayed in its original language as translation has not been provided yet. If possible, please join <a href="${SOCIAL_LINKS.GITHUB}" class="c-link" target="_blank" rel="noreferrer">Github</a> and <a href="${SOCIAL_LINKS.DISCORD}" class="c-link" target="_blank" rel="noreferrer">Discord</a> to help with translation. Thank you!`,
	},
	readMinutes: 'min read',
	word: 'words',
	tableOfContents: {
		title: 'Table of Contents',
		linkLabelToTitle: 'Title',
	},
	share: 'Share',
	more: 'More Posts',
	editLink: {
		intro: 'Found a typo or need correction?',
		label: 'Edit this page on Github',
	},
	qr: {
		title: 'QR Code',
		description: 'Share and scan this QR code for quick access to the blog post.',
		download: 'Download',
	},
} satisfies typeof import('./vi').vi;
