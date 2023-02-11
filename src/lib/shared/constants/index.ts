import { tBuild } from 'static-tree';

export const { node: APP_ROUTE_TREE } = tBuild('APP_ROUTE_TREE', {
  pathResolver: () => '',
  build: (builder) =>
    builder.addChild(':lang', {
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
  COLOR_SCHEME: 'app:color-scheme',
} as const;
