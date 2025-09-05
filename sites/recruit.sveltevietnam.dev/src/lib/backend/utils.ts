import { error, type RequestEvent } from '@sveltejs/kit';

type Backend = import('@sveltevietnam/backend').default;

// TODO: duplication with same function in main site
export function getBackend<
	Throw extends boolean = true,
	Returned = Throw extends true ? Backend : Backend | undefined,
>(event: RequestEvent, throwOnDisconnected: Throw = true as Throw): Returned {
	const { platform } = event;
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
