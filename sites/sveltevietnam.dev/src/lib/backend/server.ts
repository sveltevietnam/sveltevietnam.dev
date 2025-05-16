import { error } from '@sveltejs/kit';

export function getBackend(
	platform?: Readonly<App.Platform>,
): import('@sveltevietnam/backend').default {
	const backend = platform?.env?.backend;
	if (!backend) {
		// TODO: error logging
		error(500, { code: 'SV001', message: 'Backend not available' });
	}
	return backend;
}
