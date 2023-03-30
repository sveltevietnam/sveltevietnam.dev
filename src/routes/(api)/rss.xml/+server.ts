import Mustache from 'mustache';

// import { APP_ROUTE_TREE } from '$shared/constants';

import type { RequestHandler } from './$types';
import template from './rss.template.xml?raw';

type RssItem = {
  title: string;
  description: string;
  link: string;
  guid: string;
  pubDate: string;
};

export const GET: RequestHandler = ({ url }) => {
  const items: RssItem[] = [
    // {
    //   title: 'Svelte Vietnam',
    //   description: '',
    //   link: `${url.origin}/${APP_ROUTE_TREE.$.path()}`,
    //   guid: 'home',
    //   pubDate: new Date('2022-12-04').toUTCString(),
    // },
  ];
  const xml = Mustache.render(template, {
    title: 'Svelte Vietnam',
    link: url.origin,
    description: 'The go-to, one-stop information hub for the Svelte community in Vietnam',
    lastBuildDate: new Date(__BUILD_TIMESTAMP__).toUTCString(),
    copyright: `Copyright ${new Date().getFullYear()}, Svelte Vietnam`,
    items,
  });
  const headers = {
    'Cache-Control': 'max-age=0, s-maxage=3600',
    'Content-Type': 'application/xml',
  };
  return new Response(xml, { headers });
};
