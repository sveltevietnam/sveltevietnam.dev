import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import pico from 'picocolors';
import glob from 'tiny-glob';

import { build } from '../builder/index.js';

import { createLogger } from './logger.js';

/**
 * @param {string} root
 * @param {import('./types.public').Config} config
 * @param {import('./logger.js').CustomLogger} logger
 * @returns {Promise<string[]>} source files to watch for changes
 */
async function b(root, config, logger) {
	const inputDir = path.join(root, config.input);
	let entries = (
		await glob('*', {
			cwd: inputDir,
			filesOnly: true,
			flush: true,
			absolute: true,
		})
	)
		// for whatever reason, the dot option from tiny-glob does not yield consistent results here
		// so filter dot files manually
		.filter((f) => !path.basename(f).startsWith('.'));
	if (entries.length === 0) {
		logger.warn(`no locale entries found at ${config.input}`);
		return [];
	}

	/** @type {Record<string, string>} */
	const entryByLang = {};
	for (const entry of entries) {
		const lang = path.basename(entry, path.extname(entry));
		entryByLang[lang] = entry;
	}

	const {
		modules: {
			messages: { index, targets },
			constants,
			dts,
			remote,
		},
		sources,
		numMessages,
	} = await build({ entries: entryByLang, parseOptions: config.parseOptions, mode: config.mode });
	const outDir = path.join(root, config.output);
	await fs.mkdir(path.join(outDir, 'messages'), { recursive: true });
	await Promise.all([
		fs.writeFile(path.join(outDir, 'constants.js'), constants, 'utf-8'),
		fs.writeFile(path.join(outDir, 'messages/index.js'), index, 'utf-8'),
		...Object.entries(targets).map(([lang, module]) =>
			fs.writeFile(path.join(outDir, 'messages', `${lang}.js`), module, 'utf-8'),
		),
		fs.writeFile(path.join(outDir, 'i18n.d.ts'), dts, 'utf-8'),
		fs.writeFile(path.join(outDir, 't.remote.js'), remote, 'utf-8'),
	]);

	logger.success(
		`collected ${pico.bold(numMessages)} messages across ${pico.bold(entries.length)} languages and ${pico.bold(sources.length)} locale files.`,
	);

	return sources;
}

/**
 * @param {import('./types.public').Config} config
 * @returns {Promise<import('vite').Plugin>}
 */
export async function i18n(config) {
	let inSvelteKitProject = true;
	const logger = createLogger();
	/** @type {import('vite').ResolvedConfig} */
	let rConfig;

	/** @returns {import('./types.public').Config} */
	function resolveConfig() {
		return {
			...config,
			parseOptions: {
				...config.parseOptions,
				import: {
					...config.parseOptions?.import,
					alias: [
						...(Array.isArray(rConfig?.resolve.alias) ? rConfig.resolve.alias : []),
						...(config.parseOptions?.import?.alias ?? []),
					],
				},
			},
		};
	}

	/**
	 * @param {unknown} e
	 * @param {boolean} [rethrow=true]
	 */
	function handleError(e, rethrow = true) {
		logger.error(
			pico.red('failed to build, please fix reported errors and run your vite command again'),
		);
		// TODO: implement more readable reporter for issues
		if (!(e instanceof Error)) {
			logger.error(pico.red(`an unknown error occurred: ${e}`));
		} else if (e.cause) {
			logger.error(pico.red(`${e.name}'s cause: ${JSON.stringify(e.cause, null, 2)}`));
		} else {
			logger.error(pico.red(`${e.name}: ${e.message}`));
		}
		if (rethrow) throw e;
	}

	return {
		name: 'vite-plugin-sveltevietnam-i18n',
		enforce: 'pre',
		config(uConfig) {
			return {
				resolve: {
					alias: [
						...(config.mode === 'static'
							? [
									{
										find: /^@sveltevietnam\/i18n$/,
										replacement: '@sveltevietnam/i18n/static',
									},
								]
							: []),
						{
							find: '@sveltevietnam/i18n/generated',
							replacement: path.join(uConfig.root ?? process.cwd(), config.output),
						},
					],
				},
				optimizeDeps: {
					// prevent Vite from trying to pre-bundle these generated files,
					// this doesn't mean exclude them from resolution during dev / build
					exclude: [
						'@sveltevietnam/i18n/generated/constants',
						'@sveltevietnam/i18n/generated/t.remote',
					],
				},
			};
		},
		configResolved(config) {
			rConfig = config;
			inSvelteKitProject = !!config.plugins.find((p1) =>
				p1.name.startsWith('vite-plugin-sveltekit'),
			);
		},
		async configureServer(server) {
			const config = resolveConfig();

			/** @type {string[]} */
			let watchFiles = [];
			/** @param {string} filepath */
			async function onUpdate(filepath) {
				if (!watchFiles.includes(filepath)) return;

				const changepath = path.relative(rConfig.root, filepath);
				logger.info(`detected changes at ${pico.yellow(changepath)}, rebuilding...`);

				try {
					const oldWatchFiles = watchFiles;
					watchFiles = await b(rConfig.root, config, logger);

					const oldFileSet = new Set(watchFiles);
					const newFileSet = new Set(oldWatchFiles);
					const added = newFileSet.difference(oldFileSet);
					const removed = oldFileSet.difference(newFileSet);
					for (const file of added) {
						server.watcher.add(path.relative(rConfig.root, file));
					}
					for (const file of removed) {
						server.watcher.unwatch(file);
					}
				} catch (e) {
					handleError(e, false);
				}
			}

			try {
				watchFiles = await b(rConfig.root, config, logger);
			} catch (e) {
				handleError(e);
			}
			for (const file of watchFiles) {
				server.watcher.add(file);
			}

			server.watcher.on('add', onUpdate);
			server.watcher.on('change', onUpdate);
			server.watcher.on('unlink', onUpdate);
		},
		async buildStart() {
			// in SvelteKit, skip build for 'client', assuming already done so in 'ssr'
			if (inSvelteKitProject && this.environment.name !== 'ssr') return;

			try {
				await b(rConfig.root, resolveConfig(), logger);
			} catch (e) {
				handleError(e);
			}
		},
	};
}
