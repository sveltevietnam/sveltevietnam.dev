import { EMAILS, SOCIAL_LINKS } from '$shared/constants';

export const en = {
	title: 'Jobs',
	subtitle: 'For Svelte developers, posted by sponsors and collected from some recruitment sites',
	fromSponsors: {
		title: 'From Sponsors',
		cta: 'Become a sponsor',
		tba: {
			description: 'No job is posted yet.',
			cta: 'Sponsor Svelte Vietnam to pin your job postings.',
		},
	},
	actions: {
		title: 'Actions',
		recruiter: {
			title: 'Recruiter',
			description:
				'Individuals and organizations having sponsored Svelte Vietnam may create job postings on this site.',
			cta: 'Become a sponsor',
			whyNeedSponsor: 'Why does Svelte Vietnam need sponsorship?',
			steps: {
				sponsor: `Sponsor Svelte Vietnam via <a class="c-link" href=${SOCIAL_LINKS.OPEN_COLLECTIVE} rel="noreferrer" target="_blank">Open Collective</a>.`,
				contact: `Contact administrators via <a class="c-link" class="${SOCIAL_LINKS.DISCORD}" hrel="noreferrer" target="_blank">Discord</a> or <a class="c-link" href="mailto:${EMAILS.JOBS}" rel="noreferrer" target="_blank">${EMAILS.JOBS}<a/> to your jobs.`,
			},
		},
		candidate: {
			title: 'Candidate',
			description: 'Register to receive email notification about Svelte-related jobs',
		},
	},
	fromRecruitmentSites: {
		title: 'From Recruitment Sites',
		collectedAt: 'Collected from popular recruitment sites in Vietnam at',
		notice:
			'A service is being developed to automatically collect jobs from popular recruitment sources in Vietnam. See <a class="c-link" href="/en/roadmap">Roadmap</a> for more information.',
		tba: {
			description: 'No job has been found yet.',
			cta: 'Register for notification to receive latest jobs.',
		},
	},
} satisfies typeof import('./vi').vi;
