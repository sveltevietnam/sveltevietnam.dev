import fs from 'node:fs/promises';
import path from 'node:path/posix';
import process from 'node:process';

import pico from 'picocolors';
import glob from 'tiny-glob';

import { build } from '../builder/index.js';

import { createLogger } from './logger.js';

/**
 * @param {import('./types.public').Config} config
 * @param {import('./logger.js').CustomLogger} logger
 * @returns {Promise<string[]>} source files to watch for changes
 */
async function b(config, logger) {
	const inputDir = path.join(process.cwd(), config.input);
	let entries = (
		await glob('./*', {
			cwd: inputDir,
			filesOnly: true,
			flush: true,
			absolute: true,
		})
	).filter((f) => !f.endsWith('~'));
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
		},
		sources,
		numMessages,
	} = await build({ entries: entryByLang, parseOptions: config.parseOptions, mode: config.mode });
	const outDir = path.join(process.cwd(), config.output);
	await fs.mkdir(path.join(outDir, 'messages'), { recursive: true });
	await Promise.all([
		fs.writeFile(path.join(outDir, 'constants.js'), constants, 'utf-8'),
		fs.writeFile(path.join(outDir, 'messages/index.js'), index, 'utf-8'),
		...Object.entries(targets).map(([lang, module]) =>
			fs.writeFile(path.join(outDir, 'messages', `${lang}.js`), module, 'utf-8'),
		),
		fs.writeFile(path.join(outDir, 'i18n.d.ts'), dts, 'utf-8'),
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
	const logger = createLogger();
	/** @type {import('vite').ResolvedConfig | undefined} */
	let rConfig = undefined;

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
		config() {
			return {
				resolve: {
					alias: [
						{
							find: '$i18n',
							replacement: path.join(process.cwd(), config.output),
						},
					],
				},
			};
		},
		configResolved(config) {
			rConfig = config;
		},
		async configureServer(server) {
			const config = resolveConfig();

			/** @type {string[]} */
			let watchFiles = [];
			/** @param {string} filepath */
			async function onUpdate(filepath) {
				if (!watchFiles.includes(filepath)) return;

				const changepath = path.relative(process.cwd(), filepath);
				logger.info(`detected changes at ${pico.yellow(changepath)}, rebuilding...`);

				try {
					const oldWatchFiles = watchFiles;
					watchFiles = await b(config, logger);

					const oldFileSet = new Set(watchFiles);
					const newFileSet = new Set(oldWatchFiles);
					const added = newFileSet.difference(oldFileSet);
					const removed = oldFileSet.difference(newFileSet);
					for (const file of added) {
						server.watcher.add(path.relative(process.cwd(), file));
					}
					for (const file of removed) {
						server.watcher.unwatch(file);
					}
				} catch (e) {
					handleError(e, false);
				}
			}

			try {
				watchFiles = await b(config, logger);
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
			// skip build for 'client', assuming already done so in 'ssr'
			if (this.environment.name !== 'ssr') return;

			try {
				await b(resolveConfig(), logger);
			} catch (e) {
				handleError(e);
			}
		},
	};
}

export * from './types.public.js';
