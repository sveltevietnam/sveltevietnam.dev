import { error } from '@sveltejs/kit';
import * as m from '@sveltevietnam/i18n/generated/messages';

import * as p from '$data/routes/generated';
import { getBackend } from '$lib/backend/utils';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const backend = getBackend(event);
	const { token } = event.params;
	const { language } = event.locals;

	const result = await backend.jwt().verify<{ sub: string }>(token);
	if (!result.success) {
		error(404, { code: 'SV003', message: 'Token is not valid or has expired' });
	}

	const subscribers = backend.subscribers();
	const subscriber = await subscribers.getById(result.payload.sub);
	if (!subscriber) {
		error(404, { code: 'SV004', message: 'Subscriber not found' });
	}

	const verified = !!subscriber.verifiedAt;
	if (!verified) {
		await subscribers.verify(subscriber.id);
	}

	return {
		verified,
		routing: {
			paths: {
				vi: p['/:lang/everify/:token']({ lang: 'vi', token }),
				en: p['/:lang/everify/:token']({ lang: 'en', token }),
			},
		},
		meta: {
			title: m['pages.everify.title'](language).toString(),
		},
	};
};
