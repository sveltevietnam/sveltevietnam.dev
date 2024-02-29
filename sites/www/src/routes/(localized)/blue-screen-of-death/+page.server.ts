import { createQrUrl } from '@internals/isc/qr';

import { QR_JWT_SECRET, QR_SERVICE_URL } from '$env/static/private';
import { LOAD_DEPENDENCIES, SOCIAL_LINKS } from '$lib/constants';
import { prepareRoutePageData } from '$lib/routing/routing.server';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return {
		route: prepareRoutePageData(locals.settings.language, 'blueScreenOfDeath'),
		discordQR: await createQrUrl(QR_SERVICE_URL, QR_JWT_SECRET, {
			data: SOCIAL_LINKS.DISCORD,
			colorScheme: 'dark',
			size: 256,
		}),
		meta: {
			title: 'Blue Screen of Death | Svelte Vietnam',
			description: 'Hey look, something familiar!',
		},
	};
};
