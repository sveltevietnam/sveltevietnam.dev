import fs from 'node:fs/promises';
import path from 'node:path/posix';
import process from 'node:process';

import pico from 'picocolors';
import glob from 'tiny-glob';

import { build } from '../builder/index.js';

import { createLogger } from './logger.js';

/**
 * @typedef Config
 * @property {string} input directory path containing locale source files, relative to cwd
 * @property {string} output directory path for build artifacts, relative to cwd
 */

/**
 * @param {Config} config
 * @param {import('./logger.js').CustomLogger} logger
 * @returns {Promise<string[]>} source files to watch for changes
 */
async function b(config, logger) {
	const inputDir = path.join(process.cwd(), config.input);
	let entries = await glob('./*', { cwd: inputDir, filesOnly: true });
	entries = entries.map((entry) => path.join(inputDir, entry));
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
		},
		sources,
		numMessages,
	} = await build({ entries: entryByLang });
	const outDir = path.join(process.cwd(), config.output, 'locales');
	await fs.mkdir(path.join(outDir, 'messages'), { recursive: true });
	await Promise.all([
		fs.writeFile(path.join(outDir, 'constants.js'), constants, 'utf-8'),
		fs.writeFile(path.join(outDir, 'messages/index.js'), index, 'utf-8'),
		...Object.entries(targets).map(([lang, module]) =>
			fs.writeFile(path.join(outDir, 'messages', `${lang}.js`), module, 'utf-8'),
		),
	]);

	logger.success(
		`collected ${pico.bold(numMessages)} messages across ${pico.bold(entries.length)} languages and ${pico.bold(sources.length)} locale files.`,
	);

	return sources;
}

/**
 * @param {Config} config
 * @returns {Promise<import('vite').Plugin>}
 */
export async function i18n(config) {
	const logger = createLogger();
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
		async configureServer(server) {
			/** @type {string[]} */
			let watchFiles = [];
			/** @param {string} filepath */
			async function onUpdate(filepath) {
				if (!watchFiles.includes(filepath)) return;

				const changepath = path.relative(process.cwd(), filepath);
				logger.info(`detected changes at ${pico.yellow(changepath)}, rebuilding...`);
				for (const file of watchFiles) {
					server.watcher.unwatch(file);
				}

				watchFiles = await b(config, logger);
				for (const file of watchFiles) {
					server.watcher.add(file);
				}
			}

			watchFiles = await b(config, logger);
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
			await b(config, logger);
		},
	};
}
