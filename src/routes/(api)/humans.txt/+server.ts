import type { Config } from '@sveltejs/adapter-vercel';
import Handlebars from 'handlebars';

import { toW3CDate } from '$shared/utils/datetime';

import type { RequestHandler } from './$types';
import source from './humans.template.txt?raw';

export const GET: RequestHandler = async () => {
  const template = Handlebars.compile(source);
  const txt = template({
    last_update: toW3CDate(parseInt(__BUILD_TIMESTAMP__, 10)),
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
