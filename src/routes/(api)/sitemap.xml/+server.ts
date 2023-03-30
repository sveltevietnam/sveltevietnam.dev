import Mustache from 'mustache';

// import { APP_ROUTE_TREE } from '$shared/constants';
import { toW3CDate } from '$shared/utils/datetime';

import type { RequestHandler } from './$types';
import template from './sitemap.template.xml?raw';

/** https://www.sitemaps.org/protocol.html */
type SiteMapUrl = {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
};

export const GET: RequestHandler = ({ url }) => {
  const urls: SiteMapUrl[] = [
    // {
    //   loc: `${url.origin}/${APP_ROUTE_TREE.docs.$.path()}`,
    //   changefreq: 'monthly',
    //   priority: 0.9,
    // },
    // ...Object.values(packages).map(
    //   (pkg) =>
    //     ({
    //       loc: `${url.origin}/${pkg.path}`,
    //       changefreq: 'monthly',
    //       priority: 0.8,
    //     } satisfies SiteMapUrl),
    // ),
    {
      loc: url.origin,
      lastmod: toW3CDate(parseInt(__BUILD_TIMESTAMP__, 10)),
      changefreq: 'monthly',
      priority: 0.2,
    },
  ];
  const xml = Mustache.render(template, { urls });
  const headers = {
    'Cache-Control': 'max-age=0, s-maxage=3600',
    'Content-Type': 'application/xml',
  };
  return new Response(xml, { headers });
};
