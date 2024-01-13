import { EMAILS } from '$lib/constants';

export const en = {
	highlights: 'Highlights',
	time: 'Schedule',
	location: 'Location',
	tba: 'To be announced',
	tentative: 'tentative',
	sponsors: {
		title: 'Sponsors',
		tba: {
			description: 'Become a sponsor and help sustain our community events!',
			cta: 'Learn more',
		},
	},
	timeline: {
		title: 'Timeline',
	},
	images: {
		title: 'Gallery',
		placeholder: 'Placeholder',
	},
	proposal: {
		title: 'Become a Speaker',
		description:
			'We are accepting proposals. You can share your ideas with the community via a pre-recorded video or a live presentation at the event. We look forward to your participation!',
		links: {
			discord: 'Contact organizers via Discord',
			email: `Send your proposal to ${EMAILS.EVENTS}`,
		},
		inPageLink: 'Share your ideas by becoming a speaker!',
	},
} satisfies typeof import('./vi').vi;
