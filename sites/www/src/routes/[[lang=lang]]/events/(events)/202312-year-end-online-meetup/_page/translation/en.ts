import { en as common } from '../../../translation/en';

export const en = {
	...common,
	timeline: {
		...common.timeline,
		introduction: 'Meet and Greet',
		discussion1: 'Live Discussion: Feedback from Community',
		video1: {
			title: 'Video Stream: "A Svelte Vietnam"',
			about: 'Some statistics about the Svelte Vietnam project, and a few words from admin',
		},
		video2: 'Video Stream: "A Few Secrets of sveltevietnam.dev"',
		closing: 'Closing Remarks',
	},
	images: {
		...common.images,
		cover: 'Event cover image',
	},
} satisfies typeof import('./vi').vi;
