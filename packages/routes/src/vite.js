import fs from 'fs/promises';
import path from 'path';

import pico from 'picocolors';
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

	async function build() {
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
					let slicedPath = route.segments.default.slice(0, i + 1).join('/');
					if (slicedPath === '') slicedPath = '/';
					const def = defs[/** @type {RoutePath} */ (slicedPath)];
					if (def) {
						for (const [lang, localizedPath] of Object.entries(def)) {
							route.segments[lang] = [
								...localizedPath.split('/'),
								...route.segments.default.slice(i + 1),
							];
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
		const { modules, report } = transform(routes, {
			exclude: options.exclude,
			breadcrumbs: options.names?.breadcrumbs,
			localization: options.localization,
		});
		logger.success(
			`successfully collected info to ${pico.yellow(outdir)} for ${pico.bold(report.dynamicRoutes.length)} dynamic route(s) and ${pico.bold(report.staticRoutes.length)} static route(s) ${pico.yellow(report.excludedRoutes.length > 0 ? `(${report.excludedRoutes.length} were excluded from config` : '')})`,
		);

		await Promise.all([
			fs.writeFile(path.posix.join(absOutDir, 'index.js'), modules.routes),
			modules.types && fs.writeFile(path.posix.join(absOutDir, 'types.ts'), modules.types),
			modules.names && fs.writeFile(path.posix.join(absOutDir, 'names.js'), modules.names),
			modules.breadcrumbs &&
				fs.writeFile(path.posix.join(absOutDir, 'breadcrumbs.js'), modules.breadcrumbs),
			modules.reroute && fs.writeFile(path.posix.join(absOutDir, 'reroute.js'), modules.reroute),
		]);
	}

	return {
		name: 'sveltevietnam-routes',
		enforce: 'pre',
		api: {
			collectRoutes: async (userRoutesPath, userLogger) => {
				return collectRoutes(cwd, userRoutesPath ?? routesPath, userLogger ?? logger);
			},
		},
		async configureServer() {
			await build();
		},
		async buildStart() {
			// skip build for 'client', assuming already done so in 'ssr'
			if (this.environment.name !== 'ssr') return;
			await build();
		},
	};
}
