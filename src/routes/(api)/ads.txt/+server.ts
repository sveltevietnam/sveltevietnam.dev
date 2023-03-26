/**
 * https://humanstxt.org/
 */
import type { Config } from '@sveltejs/adapter-vercel';
import Handlebars from 'handlebars';

import type { RequestHandler } from './$types';
import source from './ads.template.txt?raw';

export const GET: RequestHandler = async () => {
  const template = Handlebars.compile(source);
  const txt = template({});
  const headers = {
    'Cache-Control': 'max-age=0, s-maxage=3600',
    'Content-Type': 'text/plain',
  };
  return new Response(txt, { headers });
};

export const config: Config = {
  runtime: 'nodejs16.x',
};
