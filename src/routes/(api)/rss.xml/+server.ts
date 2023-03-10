import type { Config } from '@sveltejs/adapter-vercel';
import Handlebars from 'handlebars';

import { BUILD_TIMESTAMP } from '$env/static/private';
import { PUBLIC_ROOT_URL } from '$env/static/public';
// import { APP_ROUTE_TREE } from '$shared/constants';

import type { RequestHandler } from './$types';
import source from './rss.template.xml?raw';

type RssItem = {
  title: string;
  description: string;
  link: string;
  guid: string;
  pubDate: string;
};

export const GET: RequestHandler = () => {
  const template = Handlebars.compile(source);
  const items: RssItem[] = [
    // {
    //   title: 'Svelte Vietnam',
    //   description: '',
    //   link: `${PUBLIC_ROOT_URL}${APP_ROUTE_TREE.$.path()}`,
    //   guid: 'home',
    //   pubDate: new Date('2022-12-04').toUTCString(),
    // },
  ];
  const xml = template({
    title: 'Svelte Vietnam',
    link: PUBLIC_ROOT_URL,
    description: 'The go-to, one-stop information hub for the Svelte community in Vietnam',
    lastBuildDate: new Date(BUILD_TIMESTAMP).toUTCString(),
    copyright: `Copyright ${new Date().getFullYear()}, Svelte Vietnam`,
    items,
  });
  const headers = {
    'Cache-Control': 'max-age=0, s-maxage=3600',
    'Content-Type': 'application/xml',
  };
  return new Response(xml, { headers });
};

export const config: Config = {
  runtime: 'nodejs16.x',
};
