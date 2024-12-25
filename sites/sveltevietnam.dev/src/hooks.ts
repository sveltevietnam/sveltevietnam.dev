import { LANGUAGES } from '@internals/utils/language';
import { delocalizeUrl, isUrlLocalized } from '@internals/utils/url';
import type { Reroute } from '@sveltejs/kit';

export const reroute: Reroute = ({ url }) => {
	if (!isUrlLocalized(url, LANGUAGES)) return url.pathname;
	return delocalizeUrl(url.pathname, LANGUAGES);
};

