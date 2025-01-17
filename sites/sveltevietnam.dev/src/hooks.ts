import type { Reroute } from '@sveltejs/kit';
import { LANGUAGES } from '@sveltevietnam/i18n';
import { delocalizeUrl, getLangFromUrl } from '@sveltevietnam/i18n/utils';

import config from '$data/routing/generated/reroute-config.json';
import { build, buildRegex } from '$lib/routing/utils';

const staticViToEn = config.staticViToEn as Record<string, string>;
const dynamicViToEn = Object.entries(config.dynamicViToEn).map(([vi, en]) => [buildRegex(vi), en] as [RegExp, string]);
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

	const pathname = delocalizeUrl(url.pathname, LANGUAGES);

	/**
	 * if lang is vi reroute to matching en svelte-kit route id
	 */
	if (lang === 'vi' && pathname in staticViToEn) {
		return staticViToEn[pathname];
	}
	for (const [regex, en] of dynamicViToEn) {
		const params = [...pathname.matchAll(regex)].map(([, p]) => p);
		if (params.length) {
			return build(en, ...params);
		}

		// NOTE: ignoring the case where lang is vi but
		// dynamic path is en because it'd add extra compute time
		// and might not be necessary at the moment
	}

	/** pass through */
	return pathname;
};

