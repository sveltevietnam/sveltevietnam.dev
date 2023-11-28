import { en as common } from '../../../translation/en';

export const en = {
	...common,
	description:
		'This is the first event of the Svelte Vietnam community and the last of 2023 \
		as we come closer to the end of yet another year full of API changes and AI news. \
		The event is expected to last for about two and a half hours, with \
		a combination of pre-record videos and live discussions. \
		We take inspiration from past events of \
		<a class="c-link" href="https://www.sveltesummit.com/" rel="noreferrer" target="_blank">Svelte Summit</a>, \
		<a class="c-link" href="https://viteconf.org/" rel="noreferrer" target="_blank">Vite Conf</a>, \
		and other events in the web platform ecosystem, and hopefully can establish a precedent for many more events to come.',
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
