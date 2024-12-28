/**
 * @template {URL | string} U
 * @template {string} L
 * @template [R=U extends string ? string : URL]
 * @param {U} url
 * @param {ReadonlyArray<L>} langs
 * @param {L} lang
 * @returns {R}
 */
export function localizeUrl(url, langs, lang) {
	/** @type {URL} */
	let rUrl;
	if (typeof url === 'string') {
		rUrl = url.startsWith('/') ? new URL('https://mocking.com' + url) : new URL(url);
	} else {
		rUrl = new URL(url);
	}

	let newPathname = '';
	const [, maybeLang, ...rest] = rUrl.pathname.split('/');
	if (!maybeLang) {
		newPathname = `/${lang}`;
	} else if (langs.some((l) => l === maybeLang)) {
		newPathname = `/${[lang, ...rest].join('/')}`;
	} else {
		newPathname = `/${[lang, maybeLang, ...rest].join('/')}`;
	}
	rUrl.pathname = newPathname;

	if (typeof url === 'string') {
		if (url.startsWith('/')) {
			return /** @type {R} */ (rUrl.pathname);
		}
		return /** @type {R} */ (rUrl.toString());
	}
	return /** @type {R} */ (rUrl);
}
