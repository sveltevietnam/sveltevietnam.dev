/**
 * https://securitytxt.org/
 */
import type { Config } from '@sveltejs/adapter-vercel';
import Handlebars from 'handlebars';

import source from './security.template.txt?raw';
import { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const template = Handlebars.compile(source);
  const expiresAt = new Date(`${new Date().getFullYear()}-12-31T23:59:59.999Z`);
  const txt = template({
    expires_at: expiresAt.toISOString(),
  });
  const headers = {
    'Cache-Control': 'max-age=0, s-maxage=3600',
    'Content-Type': 'text/plain',
  };
  return new Response(txt, { headers });
};

export const config: Config = {
  runtime: 'nodejs16.x',
};
