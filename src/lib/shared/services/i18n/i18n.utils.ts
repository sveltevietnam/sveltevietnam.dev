import { LANGUAGES } from './i18n.constants';
import type { Language } from './i18n.types';

export function localizeUrl(url: URL | string, lang: Language): URL {
  if (typeof url === 'string') {
    url = new URL(url);
  }

  let newPathname = '';
  const [, maybeLang, ...rest] = url.pathname.split('/');
  if (LANGUAGES.some((l) => l === maybeLang)) {
    newPathname = `/${[lang, ...rest].join('/')}`;
  } else {
    newPathname = `/${[lang, maybeLang, ...rest].join('/')}`;
  }
  const newUrl = new URL(url.toString());
  newUrl.pathname = newPathname;
  return newUrl;
}

export function isUrlLocalized(url: URL, lang?: Language): boolean {
  if (lang) {
    return url.pathname.startsWith(`/${lang}/`) || url.pathname === `/${lang}`;
  }
  return LANGUAGES.some(
    (lang) => url.pathname.startsWith(`/${lang}/`) || url.pathname === `/${lang}`,
  );
}

export function getLocaleFromUrl<
  Fallback extends Language | undefined,
  ReturnedLanguage = undefined extends Fallback ? Language | null : Language,
>(url: URL, fallback: Fallback = undefined as Fallback): ReturnedLanguage {
  let language: Language | null = null;
  for (const lang of LANGUAGES) {
    if (url.pathname === `/${lang}` || url.pathname.startsWith(`/${lang}/`)) {
      language = lang;
      break;
    }
  }
  if (typeof fallback === undefined) {
    return language as ReturnedLanguage;
  } else {
    return (language ?? fallback) as ReturnedLanguage;
  }
}
