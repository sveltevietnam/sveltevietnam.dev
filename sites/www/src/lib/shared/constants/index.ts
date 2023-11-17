export const LOAD_DEPENDENCIES = {
	LANGUAGE: 'site:language',
} as const;

export const SOCIAL_LINKS = {
	GITHUB: 'https://github.com/sveltevietnam',
	DISCORD: 'https://discord.sveltevietnam.dev',
	TWITTER: 'https://twitter.com/sveltevietnam',
	FACEBOOK: 'https://facebook.com/sveltevietnam',
	OPEN_COLLECTIVE: 'https://opencollective.com/sveltevietnam',
} as const;

export const EMAILS = {
	ADMIN: 'admin@sveltevietnam.dev',
	JOBS: 'jobs@sveltevietnam.dev',
	BLOG: 'blog@sveltevietnam.dev',
	CONTACT: 'contact@sveltevietnam.dev',
	COC: 'coc@sveltevietnam.dev',
	EVENTS: 'events@sveltevietnam.dev',
	IMPACT: 'impact@sveltevietnam.dev',
	SPONSOR: 'sponsor@sveltevietnam.dev',
} as const;

export const GITHUB_LINKS = {
	PROJECT: 'https://github.com/orgs/sveltevietnam/projects/1',
	PROJECT_REFERENCES:
		'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/docs/PROJECT_REFERENCES.md',
	DISCUSSION: 'https://github.com/sveltevietnam/sveltevietnam.dev/discussions',
	ISSUE: {
		CONTRIBUTOR_NOMINATION:
			'https://github.com/sveltevietnam/sveltevietnam.dev/issues/new?assignees=vnphanquang&labels=page%3Apeople%2Ctype%3Acontent&template=contributor_nomination.yaml&title=Nominate%3A+%3CName+of+member%3E',
		PUBLIC_PROJECT: '',
	},
};
