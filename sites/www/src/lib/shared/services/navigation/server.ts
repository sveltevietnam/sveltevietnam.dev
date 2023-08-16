import { delocalizeUrl, getLangFromUrl } from '@libs/utils/url';

import { LANGUAGES } from '$shared/services/i18n';

import { type Breadcrumb, ALL_PATHS, getPathLabel } from '.';

/**
 * Computationally hungry, use in server only
 */
export function buildBreadcrumbs(pathname: string, ...params: Breadcrumb[]) {
  const lang = getLangFromUrl(pathname, LANGUAGES) ?? 'vi';
  const crumbs: Breadcrumb[] = [];
  if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1);
  const chunks = delocalizeUrl(pathname, LANGUAGES).split('/');
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const path = ALL_PATHS.find((p) => p.split('/').at(-1) === chunk);
    if (!path) {
      const shifted = params.shift();
      if (shifted) crumbs.push(shifted);
    } else {
      crumbs.push({
        label: getPathLabel(path, lang),
        href: i === chunks.length - 1 ? undefined : path,
      });
    }
  }

  return crumbs;
}
