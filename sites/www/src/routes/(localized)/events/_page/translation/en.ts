export const en = {
	title: 'Events',
	subtitle: 'Meetups, conferences about Svelte and open source',
	ongoingEvents: {
		title: 'Happening Now',
	},
	upcomingEvents: {
		title: 'Upcoming Events',
		tba: {
			description: 'No event is planned yet.',
			cta: 'Register for notification about the next event.',
		},
	},
	actions: {
		title: 'Actions',
		share: {
			title: 'Share',
			description:
				'Promote products, spread ideas, or share your projects and experience in the next events.',
			call: 'Contact us via email below to register as a speaker or share your ideas about activities, meetups, talks.',
		},
		participate: {
			title: 'Participate',
			description: 'Register for email notification about upcoming events.',
		},
		sponsor: {
			title: 'Sponsor',
			description:
				'Sponsor to help organizing events, competition, and activities that nurture a healthy Svelte and open source community in Vietnam.',
			cta: 'Become a sponsor',
			whyNeedSponsor: 'Why does Svelte Vietnam need sponsorship?',
		},
		discord: 'Discuss about events at',
	},
	pastEvents: {
		title: 'Past Events',
		tba: 'Previous events will be listed here.',
	},
} satisfies typeof import('./vi').vi;
