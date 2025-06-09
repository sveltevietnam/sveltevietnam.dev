import fs from 'node:fs/promises';
import path from 'node:path/posix';
import process from 'node:process';

import pico from 'picocolors';
import glob from 'tiny-glob';

import { collectYamlGroupByDir } from './internals/collect.js';
import { lint } from './internals/lint.js';
import { flatParseMessages } from './internals/parse.js';
import { transform } from './internals/transform.js';
import { printLintIssues } from './internals/utils.js';
import { createLogger } from './logger.js';

/**
 * @typedef Config
 * @property {string} input - glob pattern for the directories containing locale files
 */

/**
 * @param {import('./logger.js').CustomLogger} logger
 * @param {string} cwd
 * @param {string[]} dirs
 * @param {boolean} [rebuild=false]
 * @returns {Promise<void>}
 */
async function build(logger, cwd, dirs, rebuild = false) {
	// 2. Collect
	const localeFileGroups = await collectYamlGroupByDir(cwd, dirs);

	// 3. Parse
	/** @type {Record<string, import('./internals/private.d.ts').FlatParseMessageOutput>} */
	const messageGroups = Object.fromEntries(
		await Promise.all(
			Object.entries(localeFileGroups).map(async ([dir, yamls]) => [
				dir,
				await flatParseMessages(yamls),
			]),
		),
	);
	const numMessages = Object.values(messageGroups).reduce((numMessages, group) => {
		return numMessages + Object.keys(group.messages).length;
	}, 0);

	// 4. Lint
	/** @type {Record<string, import('./internals/lint.js').LintOutput>} */
	const issueGroups = Object.fromEntries(
		await Promise.all(
			Object.entries(messageGroups).map(([dir, { messages, langs }]) => [
				dir,
				lint(messages, langs, false),
			]),
		),
	);
	let hasIssue = false;
	for (const [dir, lintOutput] of Object.entries(issueGroups)) {
		const issueEntries = Object.entries(lintOutput.issuesByKey);
		const numIssues = issueEntries.length;
		hasIssue = numIssues > 0;
		if (hasIssue) {
			const filepath = path.relative(cwd, dir);
			logger.error(
				`${pico.bold(numIssues)} issue(s) found in ${pico.yellow(filepath)} for the following message(s):`,
			);
			printLintIssues(issueEntries, logger.internal);
		}
	}
	if (hasIssue) {
		logger.error('Skipping build for now... Please fix the issues first.');
		return;
	}

	// 4. Transform
	/** @type {Record<string, { module: string }>} */
	const outputs = Object.fromEntries(
		await Promise.all(
			Object.entries(messageGroups).map(([dir, group]) => [dir, transform(group.messages)]),
		),
	);

	// 5. Write
	await Promise.all(
		Object.entries(outputs).map(async ([dir, output]) => {
			const outPath = path.join(dir, 'generated/messages.js');
			await fs.mkdir(path.dirname(outPath), { recursive: true });
			await fs.writeFile(outPath, output.module);
			return outPath;
		}),
	);
	logger.success(
		`successfully ${rebuild ? 'rebuilt' : 'built'} ${pico.bold(numMessages)} messages`,
	);
}

/**
 * @typedef PluginContext
 * @property {string} cwd
 * @property {string[]} dirs
 */

/**
 * @param {Config} config
 * @returns {Promise<import('vite').Plugin>}
 */
export async function i18n(config) {
	const logger = createLogger();
	const cwd = process.cwd();
	let dirs = await glob(config.input, { cwd });

	return {
		name: 'sveltevietnam-i18n',
		enforce: 'pre',
		async configureServer(server) {
			/** @param {string} filepath */
			async function onUpdate(filepath) {
				if (path.extname(filepath) !== '.yaml') return;
				dirs = await glob(config.input, { cwd });

				const dir = path.relative(cwd, path.dirname(filepath));
				if (!dirs.includes(dir)) return;

				const changepath = path.relative(cwd, filepath);
				logger.info(`detected changes at ${pico.yellow(changepath)}, rebuilding...`);

				build(logger, cwd, [dir], true);
			}

			server.watcher.add(path.join(config.input, '*.yaml'));
			server.watcher.on('add', onUpdate);
			server.watcher.on('change', onUpdate);
			server.watcher.on('unlink', onUpdate);

			await build(logger, cwd, dirs);
		},
		async buildStart() {
			// skip build for 'client', assuming already done so in 'ssr'
			if (this.environment.name !== 'ssr') return;
			await build(logger, cwd, dirs);
		},
	};
}
