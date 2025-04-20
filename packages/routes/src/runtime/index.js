export * from './types.public.js';

/**
 * @param {string} path
 * @param {import('./types.public.d.ts').DynamicMapping[]} mappings
 * @return {string | false}
 */
export function matchDynamicPath(path, mappings) {
	const segments = path.split('/');
	for (const mapping of mappings) {
		const { localized, paramPositions, kit } = mapping;

		// must have the same number of segments
		if (segments.length !== localized.length) continue;

		// must match each segment, except params
		for (const i of paramPositions) {
			localized[i] = segments[i];
			kit[i] = segments[i];
		}

		if (localized.join('/') === path) {
			return kit.join('/');
		}
	}

	return false;
}

/**
 * Creates a factory function that returns
 * a compatible SvelteKit reroute hook.
 * @param {Record<string, string>} staticMappings
 * @param {import('./types.public.d.ts').DynamicMapping[]} dynamicMappings
 * @return {import('./types.public.d.ts').RerouteFactory}
 */
export function createRerouteFactory(staticMappings, dynamicMappings) {
	return function (getLang) {
		return function (event) {
			const pathname = event.url.pathname;
			if (getLang) {
				const lang = getLang(event);
				if (!lang || pathname === `/${lang}`) return pathname;
			}

			if (pathname in staticMappings) {
				return staticMappings[pathname];
			}

			const dynamicPath = matchDynamicPath(pathname, dynamicMappings);
			if (dynamicPath) {
				return dynamicPath;
			}

			return pathname;
		};
	};
}
