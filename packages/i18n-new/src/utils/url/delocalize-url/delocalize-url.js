/**
 * @template {URL | string} U
 * @template [R=U extends string ? string : URL]
 * @param {U} url
 * @param {ReadonlyArray<string>} langs
 * @returns {R}
 */
export function delocalizeUrl(url, langs) {
	/** @type {URL} */
	let rUrl;
	if (typeof url === 'string') {
		rUrl = url.startsWith('/') ? new URL('https://mocking.com' + url) : new URL(url);
	} else {
		rUrl = new URL(url);
	}

	let pathname = rUrl.pathname;
	for (const lang of langs) {
		if (pathname === `/${lang}` || pathname.startsWith(`/${lang}`)) {
			pathname = pathname.substring(lang.length + 1);
		}
	}
	rUrl.pathname = pathname || '/';

	if (typeof url === 'string') {
		if (url.startsWith('/')) {
			return /** @type {R} */ (rUrl.pathname);
		}
		return /** @type {R} */ (rUrl.toString());
	}
	return /** @type {R} */ (rUrl);
}
