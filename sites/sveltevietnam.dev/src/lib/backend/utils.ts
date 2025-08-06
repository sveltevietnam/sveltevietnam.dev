import { error } from '@sveltejs/kit';

import { getRequestEvent } from '$app/server';

type Backend = import('@sveltevietnam/backend').default;

export function getBackend<
	Throw extends boolean = true,
	Returned = Throw extends true ? Backend : Backend | undefined,
>(throwOnDisconnected: Throw = true as Throw): Returned {
	const { platform } = getRequestEvent();
	const backend = platform?.env?.backend;
	if (!backend) {
		// TODO: error logging
		error(500, { code: 'SV001', message: 'Backend not available' });
	}
	try {
		if (backend.healthy) return backend as Returned;
	} catch {
		if (throwOnDisconnected) {
			// TODO: error logging
			error(500, { code: 'SV001', message: 'Backend is not healthy' });
		}
	}
	return undefined as Returned;
}
