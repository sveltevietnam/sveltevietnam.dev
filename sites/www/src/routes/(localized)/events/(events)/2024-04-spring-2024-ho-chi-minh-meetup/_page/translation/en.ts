import { en as common } from '../../../translation/en';

export const en = {
	...common,
	hostedBy: 'Hosted by',
	timeline: {
		...common.timeline,
		introduction: 'Meet and Greet',
		closing: 'Closing Remarks',
	},
	ticket: {
		title: 'Reserve Your Free E-Ticket',
		form: {
			name: 'Name',
			cta: 'Register',
			checkbox: 'I agree to receive notification about upcoming events.',
		},
	},
	faq: {
		whyTicket: {
			q: 'Why do I need to register for a ticket? Does it require any payment?',
			a: 'The event is free. However, due to limited seating, you should reserve your ticket. This also helps organizers better prepare for the event.',
		},
		howToGetThere: {
			q: 'How do I find the location of the event?',
			a: 'Organizers are looking for a suitable location at the moment and will notify you when there is more information.',
		},
	},
	proposal: {
		...common.proposal,
		guidelines:
			'Your video or presentation should be no more than 20 minutes. Its content should be about a project, product, or experience related to communities or technologies in the Svelte ecosystem. Check out <a class="c-link" href="https://www.sveltesummit.com/" rel="noreferrer" target="_blank">previous talks from Svelte Summit</a> for examples.',
	},
} satisfies typeof import('./vi').vi;
