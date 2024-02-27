import { en as common } from '../../../translation/en';

export const en = {
	...common,
	hostedBy: 'Hosted by',
	becomeSpeaker: 'Become a speaker and share your experience with the community',
	timeline: {
		...common.timeline,
		introduction: 'Meet and Greet',
		share: 'Sharing Session',
		share1: {
			title: 'Svelte, Javascript, and the Web',
			about:
				"\
				Are you a Svelte developer, a Javascript developer, a frontend developer, or a web developer? \
				How does Svelte fit into the web ecosystem today? Why should you care? \
				Let's talk! \
			",
		},
		discussion: 'Open Discussion',
		closing: 'Closing Remarks',
	},
	ticket: {
		description:
			'\
			We are excited to partner with <a class="c-link" href="https://www.designveloper.com" target="_blank" rel="noreferrer">Designveloper</a>\
			to bring you the Spring 2024 Meetup in Ho Chi Minh city, the first offline event from the Svelte Vietnam community.\
			We welcome everyone regardless of background and skill level to join us, connect with our\
			community, and share your Svelte experience.\
		',
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
			'\
			Your video or presentation should be no more than 20 minutes. \
			Its content should be about a project, product, or experience related to \
			communities or technologies in the Svelte ecosystem. \
			Check out <a class="c-link" href="https://www.sveltesummit.com/" rel="noreferrer" target="_blank">previous talks from Svelte Summit</a> for examples.\
		',
	},
} satisfies typeof import('./vi').vi;
