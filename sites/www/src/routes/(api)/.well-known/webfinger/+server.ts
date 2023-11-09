/**
 * https://webfinger.net/
 */
import type { RequestHandler } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

import { EMAILS } from '../../../../lib/shared/constants';
import {
  CODE_OF_CONDUCT_PATH,
  EVENTS_PATH,
  IMPACT_PATH,
  ROOT_URL,
  SPONSOR_PATH,
} from '../../../../lib/shared/services/navigation';

/** https://www.rfc-editor.org/rfc/rfc7033#section-4.4.4 */
type WebFingerLink = {
  /** https://www.rfc-editor.org/rfc/rfc7033#section-4.4.4.1 */
  rel: string;
  /** https://www.rfc-editor.org/rfc/rfc7033#section-4.4.4.2 */
  type?: string;
  /** https://www.rfc-editor.org/rfc/rfc7033#section-4.4.4.3 */
  href: string;
  /** https://www.rfc-editor.org/rfc/rfc7033#section-4.4.4.4 */
  titles?: Record<string, string>;
  /** https://www.rfc-editor.org/rfc/rfc7033#section-4.4.4.5 */
  properties?: Record<string, string>;
};

/** https://www.rfc-editor.org/rfc/rfc7033#section-4.4 */
type WebFinger = {
  /** https://www.rfc-editor.org/rfc/rfc7033#section-4.4.1 */
  subject?: string;
  /** https://www.rfc-editor.org/rfc/rfc7033#section-4.4.2 */
  aliases?: string[];
  /** https://www.rfc-editor.org/rfc/rfc7033#section-4.4.3 */
  properties?: Record<string, string>;
  /** https://www.rfc-editor.org/rfc/rfc7033#section-4.4.4 */
  links?: WebFingerLink[];
};

const SVELTE_VIETNAM_AVATAR_LINKS: WebFingerLink[] = [
  {
    rel: 'http://webfinger.net/rel/avatar',
    type: 'image/jpeg',
    href: `${ROOT_URL}/logo/original.jpg`,
  },
  {
    rel: 'http://webfinger.net/rel/avatar',
    type: 'image/png',
    href: `${ROOT_URL}/logo/original.png`,
  },
  {
    rel: 'http://webfinger.net/rel/avatar',
    type: 'image/svg+xml',
    href: `${ROOT_URL}/logo/original.svg`,
  },
];

export const GET: RequestHandler = async ({ url }) => {
  // let baseUrl = url.origin
  let resource = decodeURI(url.searchParams.get('resource') ?? '');
  const rels = url.searchParams.getAll('rel').map(decodeURI);

  if (resource.startsWith(url.origin)) {
    resource = url.origin;
  }

  let webfinger: WebFinger = {
    subject: resource,
  };
  switch (resource) {
    case `account:${EMAILS.CONTACT}`:
    case `mailto:${EMAILS.CONTACT}`:
      webfinger.aliases = [`account:${EMAILS.CONTACT}`, `mailto:${EMAILS.CONTACT}`];
      webfinger.links = [
        {
          rel: 'http://webfinger.net/rel/profile-page',
          href: ROOT_URL,
        },
        ...SVELTE_VIETNAM_AVATAR_LINKS,
      ];
      break;
    case `mailto:${EMAILS.COC}`:
      webfinger.links = [
        {
          rel: 'http://webfinger.net/rel/profile-page',
          href: `${ROOT_URL}${CODE_OF_CONDUCT_PATH}`,
        },
        ...SVELTE_VIETNAM_AVATAR_LINKS,
      ];
      break;
    case `mailto:${EMAILS.EVENTS}`:
      webfinger.links = [
        {
          rel: 'http://webfinger.net/rel/profile-page',
          href: `${ROOT_URL}${EVENTS_PATH}`,
        },
        ...SVELTE_VIETNAM_AVATAR_LINKS,
      ];
      break;
    case `mailto:${EMAILS.IMPACT}`:
      webfinger.links = [
        {
          rel: 'http://webfinger.net/rel/profile-page',
          href: `${ROOT_URL}${IMPACT_PATH}`,
        },
        ...SVELTE_VIETNAM_AVATAR_LINKS,
      ];
      break;
    case `mailto:${EMAILS.SPONSOR}`:
      webfinger.links = [
        {
          rel: 'http://webfinger.net/rel/profile-page',
          href: `${ROOT_URL}${SPONSOR_PATH}`,
        },
        ...SVELTE_VIETNAM_AVATAR_LINKS,
      ];
      break;
    case url.origin:
      webfinger.links = [
        {
          rel: 'author',
          href: 'https://github.com/sveltevietnam',
        },
        {
          rel: 'license',
          href: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/LICENSE',
        },
      ];
      break;
    case '':
      throw error(400, {
        message: 'Missing resource parameter',
      });
    default:
      throw error(404, {
        message: 'Resource not found',
      });
  }
  const headers = {
    'Cache-Control': 'max-age=0, s-maxage=3600',
    'Content-Type': 'application/jrd+json',
  };

  if (rels.length && webfinger.links?.length) {
    webfinger.links = webfinger.links.filter((link) => rels.includes(link.rel));
  }
  return new Response(JSON.stringify(webfinger), { headers });
};
