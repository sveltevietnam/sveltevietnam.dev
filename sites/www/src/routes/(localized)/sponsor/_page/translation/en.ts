import { EMAILS, SOCIAL_LINKS } from '$lib/constants';

export const en = {
	title: 'Sponsor',
	subtitle: 'Maintain creativity',
	how: {
		title: 'How to sponsor Svelte Vietnam?',
		description:
			'Svelte Vietnam chooses <a class="c-link font-bold" href="https://docs.opencollective.com/help/about/introduction" target="_blank" rel="noreferrer">Open Collective</a> to receive financial contributions from sponsors (individuals or organizations). It provides the necessary platform and toolbox for money management with high transparency: all donation and spending are made public.',
		contribute:
			'If you cannot donate or simply want to make more direct contribution to the Svelte Vietnam community, please visit the following links. Thank you!',
		ctas: {
			sponsor: 'Sponsor Svelte Vietnam via Open Collective',
			discord: 'Chat with the community via the Svelte Vietnam Discord',
			email: `Send questions to <em>${EMAILS.SPONSOR}</em>`,
			events: 'Help organize or provide space for events',
			blog: 'Share products, ideas, and experience through Blog',
			github: 'Participate in ongoing projects at Github',
		},
	},
	why: {
		title: 'Why does Svelte Vietnam need sponsorship?',
		description:
			'Svelte Vietnam is not a business, nor does it intend to commercialize any project or product. However, money is needed if we want to build a healthy community at scale, one that can encourage members to connect, share, and grow via forums and events. To better understand what Svelte Vietnam is and trying to be, read the blog post "<a class="c-link" href="/en/blog/20231012-svelte-vietnam-from-local-to-global">Svelte Vietnam: from Local to Global</a>".',
		for: {
			description: 'Specifically, Svelte Vietnam will use its fund for:',
			bullets: {
				maintain:
					'<strong>Maintain</strong> a stable and secure infrastructure (Cloudflare). Currently Svelte Vietnam is built and paid for by individual and voluntary effort. Having dedicated funding means these members will not have to paid for infrastructure cost out of their own pockets.',
				create:
					'<strong>Create</strong> high-quality content, events, and activities to promote community growth and open source initiatives.',
			},
		},
		inspect: `As discussed in the <a href="#how" class="c-link">previous section</a>, the list of sponsors, donations, and expenses are recorded publicly by the <a class="c-link" href="${SOCIAL_LINKS.OPEN_COLLECTIVE}" target="_blank" rel="noreferrer noopener">Svelte Vietnam Open Collective</a>.`,
	},
	benefits: {
		title: 'What do I get as a sponsor for Svelte Vietnam?',
		description:
			'Sponsors are listed on this website, as well as projects and events of Svelte Vietnam. In the near future when the “Jobs” page is implemented, sponsors will have priority for their job posting requests. Svelte Vietnam also provides opportunities during its events for sponsors to promote their brands and products.',
	},
} satisfies typeof import('./vi').vi;
