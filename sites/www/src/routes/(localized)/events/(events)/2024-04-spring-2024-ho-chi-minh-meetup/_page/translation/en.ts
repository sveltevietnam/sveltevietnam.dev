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
		title: 'Frequent Asked Questions',
		entries: {
			whyTicket: {
				q: 'Why do I need to register for a ticket? Does it require any payment?',
				a: 'The event is free. However, due to limited seating, you should reserve your ticket. This also helps organizers better prepare for the event.',
			},
			noTicket: {
				q: 'Can I still come if I have not registered?',
				a: '\
					Although registration for an e-ticket is highly recommended; you can still come to the event without one. \
					We will try our best to support you there.\
				',
			},
			whenAndWhere: {
				q: 'What is the time and location of the event?',
				a: `\
					The event takes place on the 20th of April, 2024 at 9am Vietnam Time,\
					and is hosted by \
					<a class="c-link" href="https://www.designveloper.com" target="_blank" rel="noreferrer">Designveloper</a> at \
					<a class="c-link" href="https://maps.app.goo.gl/ymGh3Djmwjnb7ohu5" target="_blank" rel="noreferrer">6th floor, 55 Pho Duc Chinh, Dist. 1, Ho Chi Minh City</a>. \
					Parking is available at the building. Any other instructions will be given when you arrive.<br><br>\
					The same information can be found at the top of this page and in the confirmation email upon registration. \
				`,
			},
			requirement: {
				q: 'What do I need to bring with me to the event?',
				a: "\
					Only the check-in QR code, if you have registered for a ticket. \
					You can find said code in the confirmation email \
					(check your spam if you don't see it in your regular inbox). \
					Just show the QR code to our organizers at the event entrance.\
				",
			},
			help: {
				q: 'How to help or get help?',
				a: '\
					Join us at our official <a class="c-link" href="https://discord.sveltevietnam.dev" target="_blank" rel="noreferrer">Discord server</a>, \
					where you can get help from admin as well as other community members.<br>\
					Likewise, we can always use an extra hand at the event. Simply reach out via Discord and we will discuss more. \
					Thank you!\
				',
			},
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
