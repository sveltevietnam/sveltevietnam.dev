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
	links: {
		watch: 'Watch the live stream (stay anonymous with popcorn!)',
		join: 'Join the meetup (smile, you will be on camera!) - to be announced',
		discuss: 'Join community chat at Discord',
	},
	timeline: {
		...common.timeline,
		introduction: 'Meet and Greet',
		discussion: 'Live Discussion',
		discussion1: 'Feedback from Community',
		video: 'Video Stream',
		video1: {
			title: 'A Svelte Vietnam',
			about: 'Some statistics about the Svelte Vietnam project, and a few words from admin',
		},
		video2: 'A Few Secrets of sveltevietnam.dev',
		// demo1: {
		// 	title: 'Live Demo: "Writing a Post for the Svelte Vietnam Blog',
		// 	demo: 'A very quick demo about the making of a static blog post. Through this, I hope you can see how easy it is to write / code a post and get a feel of the workflow and codebase of sveltevietnam.dev.',
		// },
		closing: 'Closing Remarks',
	},
	proposal: {
		...common.proposal,
		guidelines:
			'Your video or presentation should be less than 20 minutes. Its content should be about a project, product, or experience related to communities or technologies in the Svelte ecosystem.',
	},
	images: {
		...common.images,
		cover: 'Event cover image',
	},
} satisfies typeof import('./vi').vi;
