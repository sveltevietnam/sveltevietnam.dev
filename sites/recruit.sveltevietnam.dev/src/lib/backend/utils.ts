import type { R2Bucket } from '@cloudflare/workers-types';
import { error, type RequestEvent } from '@sveltejs/kit';

import { getRequestEvent } from '$app/server';

type Backend = import('@sveltevietnam/backend').default;

interface BaseOptions {
	event?: RequestEvent;
}

interface GetBackendOptions<Throw extends boolean> extends BaseOptions {
	throwOnDisconnected?: Throw;
}

// TODO: duplication with same function in main site
export function getBackend<
	Throw extends boolean = true,
	Returned = Throw extends true ? Backend : Backend | undefined,
>(options?: GetBackendOptions<Throw>): Returned {
	const event = options?.event ?? getRequestEvent();
	const throwOnDisconnected = options?.throwOnDisconnected ?? (true as Throw);
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

export function getEmployerImagePath(employerId: string) {
	return `/employers/${employerId}/image`;
}

/**
 * Get Cloudflare R2 binding from platform
 */
export function getR2(options?: BaseOptions): R2Bucket {
	const event = options?.event ?? getRequestEvent();
	const r2 = event.platform?.env?.r2;
	if (!r2) {
		error(500, { code: 'SV001', message: 'R2 not available' });
	}
	return r2;
}
