import fs from 'fs/promises';
import path from 'path';

import pico from 'picocolors';
// import glob from 'tiny-glob';
import { stringify } from 'yaml';

import { collectRoutes } from './internals/collect.js';
import { transform } from './internals/transform.js';
import { createLogger } from './logger.js';

/**
 * @template {string} [RoutePath=string]
 * @template {string} [Language=string]
 * @param {Partial<import('./private.d.ts').RoutesOptions<RoutePath, Language>>} options
 * @returns {Partial<import('./private.d.ts').RoutesOptions<RoutePath, Language>>}
 */
export function defineConfig(options) {
	return options;
}

/**
 * @template {string} [RoutePath=string]
 * @template {string} [Language=string]
 * @param {Partial<import('./private.d.ts').RoutesOptions<RoutePath, Language>>} [options]
 * @returns {Promise<import('vite').Plugin<import('./private.d.ts').RoutesVitePluginApi>>}
 */
export async function routes(options = {}) {
	const logger = createLogger();
	let cwd = process.cwd();

	const routesPath = options.routes || 'src/routes';
	const outdir = options.outdir || 'src/lib/routes';

	return {
		name: 'sveltevietnam-routes',
		enforce: 'pre',
		api: {
			collectRoutes: async (userRoutesPath, userLogger) => {
				return collectRoutes(cwd, userRoutesPath ?? routesPath, userLogger ?? logger);
			},
		},
		async buildStart() {
			// collect
			const routes = await collectRoutes(cwd, routesPath, logger);

			// merge localization options
			if (options.localization) {
				const defs = options.localization.defs;
				for (const route of routes) {
					route.segments = {
						default: /** @type {string[]} */ (route.segments),
					};

					for (let i = route.segments.default.length - 1; i >= 0; i--) {
						const slicedPath = '/' + route.segments.default.slice(0, i + 1).join('/');
						const def = defs[/** @type {RoutePath} */ (slicedPath)];
						if (def) {
							for (const [lang, localizedPath] of Object.entries(def)) {
								route.segments[lang] = localizedPath.split('/').filter(Boolean);
							}
							break;
						}
					}
				}
			}

			// merge name options
			if (options.names) {
				for (const route of routes) {
					route.name = options.names.defs[/** @type {RoutePath} */ (route.path)];
				}
			}

			// create output directory in advance
			const absOutDir = path.posix.join(cwd, outdir);
			await fs.mkdir(absOutDir, { recursive: true });

			// print debug yaml
			if (options.debug) {
				logger.info(`${pico.bgYellowBright(pico.black(' Debug '))} Writing debug YAML file`);
				const yaml = stringify({ routes });
				await fs.writeFile(path.posix.join(absOutDir, 'routes.yaml'), yaml);
			}

			// transform
			const { modules, report } = transform(routes, options.localization?.param);
			logger.success(
				`successfuly collected info of ${pico.bold(report.dynamicRoutes.length)} dynamic and ${pico.bold(report.staticRoutes.length)} static routes to ${pico.yellow(outdir)}`,
			);

			await Promise.all([
				fs.writeFile(path.posix.join(absOutDir, 'index.js'), modules.routes),
				modules.names && fs.writeFile(path.posix.join(absOutDir, 'names.js'), modules.names),
				modules.types && fs.writeFile(path.posix.join(absOutDir, 'types.ts'), modules.types),
			]);
		},
	};
}
