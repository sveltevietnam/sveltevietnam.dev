export const LOAD_DEPENDENCIES = {
  COLOR_SCHEME: 'site:color-scheme',
  LANGUAGE: 'site:language',
} as const;

export const SOCIAL_LINKS = {
  github: 'https://github.com/sveltevietnam',
  discord: 'https://discord.gg/Rtv2xwhz7d',
  twitter: 'https://twitter.com/sveltevietnam',
  facebook: 'https://facebook.com/sveltevietnam',
  openCollective: 'https://opencollective.com/sveltevietnam',
} as const;

export const EMAILS = {
  admin: 'admin@sveltevietnam.dev',
  contact: 'contact@sveltevietnam.dev',
  coc: 'coc@sveltevietnam.dev',
  events: 'events@sveltevietnam.dev',
  impact: 'impact@sveltevietnam.dev',
  sponsor: 'sponsor@sveltevietnam.dev',
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

export const CLOUDFLARE_TURNSTILE_FORM_FIELD = 'turnstile';
