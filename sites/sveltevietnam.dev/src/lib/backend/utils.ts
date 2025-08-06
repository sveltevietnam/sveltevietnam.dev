import { error } from '@sveltejs/kit';

import { getRequestEvent } from '$app/server';

type Backend = import('@sveltevietnam/backend').default;

export function getBackend<Throw extends boolean = true>(
	throwOnMissing?: Throw,
): Throw extends true ? Backend : Backend | undefined {
	const { platform } = getRequestEvent();
	const backend = platform?.env?.backend;
	if (!backend && throwOnMissing) {
		// TODO: error logging
		error(500, { code: 'SV001', message: 'Backend not available' });
	}
	return backend as Backend;
}
