import { LANGUAGES } from '@internals/i18n';
import { delocalizeUrl, getLangFromUrl } from '@internals/i18n/utils';
import type { Reroute } from '@sveltejs/kit';

import config from '$data/routing/generated/reroute-config.json';

const viToEn = config.viToEn as Record<string, string>;
const mismatchedPathSet = new Set(config.mismatchedPaths);

export const reroute: Reroute = ({ url }) => {
	const lang = getLangFromUrl(url.pathname, LANGUAGES);

	/** pass through if url is not localized (e.g. api calls) */
	if (!lang) return url.pathname;

	/**
	 * 404 out if lang is of vi but path is of en
	 * e.g. /vi/design
	 */
	if (mismatchedPathSet.has(url.pathname)) return 'mismatch-vi-lang-but-en-path';

	let pathname = delocalizeUrl(url.pathname, LANGUAGES);

	// FIXME: workaround for https://github.com/sveltejs/kit/issues/11625
	let suffix = '';
	const segments = pathname.split('/');
	const lastSegment = segments.at(-1);
	if (lastSegment && /\.\w+$/.test(lastSegment)) {
		suffix = '/' + lastSegment;
		pathname = segments.slice(0, -1).join('/');
	}

	/**
	 * if lang is vi reroute to matching en svelte-kit route id
	 */
	if (lang === 'vi' && pathname in viToEn) {
		return viToEn[pathname] + suffix;
	}

	/** pass through */
	return pathname + suffix;
};
