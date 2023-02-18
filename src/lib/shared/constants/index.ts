import { tBuild } from 'static-tree';

export const { node: APP_ROUTE_TREE } = tBuild('APP_ROUTE_TREE', {
  pathResolver: () => '',
  build: (builder) =>
    builder.addChild(':lang', {
      pathResolver: (_, lang) => lang,
      build: (builder) =>
        builder
          .addChild('events')
          .addChild('jobs')
          .addChild('impact')
          .addChild('people')
          .addChild('sponsor')
          .addChild('code-of-conduct'),
    }),
});

export const LOAD_DEPENDENCIES = {
  COLOR_SCHEME: 'site:color-scheme',
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
  coc: 'coc@sveltevietnam.dev',
  contact: 'contact@sveltevietnam.dev',
  events: 'events@sveltevietnam.dev',
  impact: 'impact@sveltevietnam.dev',
  sponsor: 'sponsor@sveltevietnam.dev',
} as const;
