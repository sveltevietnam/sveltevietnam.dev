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
			time: '15min presentation, 10min Q&A',
			title: 'Svelte, Javascript, and the Web',
			description:
				"\
				Are you a Svelte developer, a Javascript developer, a frontend developer, or a web developer? \
				How does Svelte fit into the web ecosystem today? Why should you care? \
				Let's talk! \
			",
		},
		share2: {
			time: '15min presentation, 10min Q&A',
			title: 'Web Designer and Svelte - Journey to Discover Freedom of Creativity',
			description:
				'\
				Embarking on a journey from UI/UX to Svelte as a pathway to kindle creativity, \
				broaden design capabilities through the art of coding, and \
				enable an unparalleled freedom to breathe life into ideas \
				\
			',
		},
		qa1: {
			title: 'Svelte and Its Ecosystem',
			description:
				'\
				Svelte is still relatively new in Vietnam, not being as popular as other comparable technologies are; \
				it is not uncommon that you have many unanswered questions and concerns. \
				This Q&A session will hopefully help you gain a better insight. Ask away! \
			',
		},
		discussion1: {
			title: 'Discussion: "Open Source - Challenges and Opportunities"',
			description:
				"\
				Have you ever contributed to a library, source code, issue on Github, \
				or participate in asking / answering questions via forums such as Discord, \
				Reddit, Stack Overflow? If yes, you are already a part of the international \
				open source community. Let's hear our members share about their story and experience with open source \
				in this discussion session.\
			",
		},
		qa: 'Q&A',
		openDiscussion: 'Open Discussion',
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
					Although registration for an e-ticket is highly recommended, you can still come to the event without one. \
					We will try our best to support you there.\
				',
			},
			whenAndWhere: {
				q: 'What is the time and location of the event?',
				a: `\
					The event takes place on the 20th of April, 2024 at 9am Vietnam Time,\
					and is hosted by \
					<a class="c-link" href="https://www.designveloper.com" target="_blank" rel="noreferrer">Designveloper</a> on \
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
	imageCredit: 'Background images from Unsplash by',
	musicCredit: 'Music used in event composed and given permission by',
} satisfies typeof import('./vi').vi;
