import path from 'path';

import pico from 'picocolors';
import glob from 'tiny-glob';

/**
 * @template {import('vite').Logger} Logger
 * @param {string} cwd
 * @param {string} routesPath
 * @param {Logger} logger
 * @returns {Promise<import('../private.d.ts').Route[]>}
 */
export async function collectRoutes(cwd, routesPath, logger) {
	const pagePattern = path.posix.join(routesPath, '**', '+page*.svelte');
	const serverPattern = path.posix.join(routesPath, '**', '+server.{ts,js}');
	let kitPagePaths = (
		await Promise.all([glob(pagePattern, { cwd }), glob(serverPattern, { cwd })])
	).flatMap((paths) => paths.map((p) => path.dirname(path.relative(routesPath, p))));

	if (process.platform === 'win32') {
		kitPagePaths = kitPagePaths.map((p) => p.replaceAll(path.win32.sep, path.posix.sep));
	}

	/** @type {import('../private.d.ts').Route[]} */
	const routes = [];
	for (const pagePath of kitPagePaths) {
		/** @type {string[]} */
		const segments = [];
		/** @type {import('../private.d.ts').Route['params']} */
		const params = [];

		const chunks = pagePath.split(path.posix.sep);
		for (let i = 0; i < chunks.length; i++) {
			const chunk = chunks[i];
			// ignore layout group
			if (chunk.startsWith('(') && chunk.endsWith(')')) {
				if (chunks.length === 1) {
					// root path
					segments.push('');
				}
				continue;
			}

			// parse param
			if (chunk.startsWith('[') && chunk.endsWith(']')) {
				const required = !chunk.startsWith('[[');
				const matches = chunk.match(/\[+(?:\.\.\.)?([^\]=]*)=?[^\]]*\]+/);

				if (!matches) {
					logger.warn(
						`Fail to parse "${pico.yellow(chunk)}" segment of ${pico.yellow(pagePath)} route`,
					);
					break;
				}

				const param = matches[1];
				segments.push(`:${param}${required ? '' : '?'}`);
				params.push({
					position: segments.length - 1,
					name: param,
					required,
				});
				continue;
			}

			segments.push(chunk);
		}

		if (segments.length) {
			const path = '/' + segments.join('/');
			routes.push({
				path,
				segments,
				...(params.length && { params }),
			});
		}
	}

	return routes;
}
