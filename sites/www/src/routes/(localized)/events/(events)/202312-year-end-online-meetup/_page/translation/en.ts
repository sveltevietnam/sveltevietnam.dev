import { en as common } from '../../../translation/en';

export const en = {
	...common,
	description:
		'This was the first event of the Svelte Vietnam community and the last of 2023 \
		as we came closer to the end of yet another year full of API changes and AI news. \
		The event lasted for about two hours, with \
		a combination of pre-record videos and live discussions. \
		We took inspiration from past events of \
		<a class="c-link" href="https://www.sveltesummit.com/" rel="noreferrer" target="_blank">Svelte Summit</a>, \
		<a class="c-link" href="https://viteconf.org/" rel="noreferrer" target="_blank">Vite Conf</a>, \
		and other events in the web platform ecosystem, and hopefully would establish a precedent for many more events to come.',
	credit:
		'Shout out to community members who took time to join the meetup: \
		Tymon, Bắc, Tuấn, and those in or outside the community who watched the livestream at Youtube.\
		<br><br>\
		A big thanks to <a class="c-link" href="https://maiduchuy.com/" rel="noreferrer" target="_blank">Huy Mai</a> for giving us permission to use his music for the event.\
		',
	links: {
		rewatch: 'Re-watch the livestream on Youtube',
		// watch: 'Watch the live stream (stay anonymous with popcorn!)',
		// join: 'Join the meetup (smile, you will be on camera!)<br>Password: <em>sveltevietnam</em>',
		discuss: 'Join community chat at Discord',
	},
	timeline: {
		...common.timeline,
		introduction: 'Meet and Greet',
		discussion: 'Live Discussion',
		discussion1: 'Feedback from Community',
		discussion2: 'Open Discussion',
		video: 'Video Stream',
		video1: {
			title: 'A Svelte Vietnam',
			about: 'Some statistics about the Svelte Vietnam project, and a few words from admin',
		},
		video2: 'A Few Secrets of sveltevietnam.dev',
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
		moment: 'Livestream moment. Members: Tymon, Bắc, Tuấn (not visible), and Quang',
	},
} satisfies typeof import('./vi').vi;
