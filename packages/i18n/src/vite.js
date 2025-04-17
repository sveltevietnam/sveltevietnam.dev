import fs from 'node:fs/promises';
import path from 'node:path/posix';

import pico from 'picocolors';
import glob from 'tiny-glob';

import { collectYamls } from './internals/collect.js';
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
	const localeFileGroups = await Promise.all(dirs.map((dir) => collectYamls(cwd, dir)));

	// 3. Parse
	const messageGroups = await Promise.all(
		localeFileGroups.map((yamls) => flatParseMessages(yamls)),
	);
	const numMessages = messageGroups.reduce((numMessages, group) => {
		return numMessages + Object.keys(group.messages).length;
	}, 0);

	// 4. Lint
	const issueGroups = await Promise.all(
		messageGroups.map(({ messages, langs }) => lint(messages, langs, false)),
	);
	let hasIssue = false;
	for (let i = 0; i < issueGroups.length; i++) {
		const issueEntries = Object.entries(issueGroups[i].issuesByKey);
		const numIssues = issueEntries.length;
		hasIssue = numIssues > 0;
		if (hasIssue) {
			const filepath = path.relative(cwd, dirs[i]);
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
	const outputs = await Promise.all(messageGroups.map(async (group) => transform(group.messages)));

	// 5. Write
	await Promise.all(
		outputs.map(async (output, index) => {
			const outPath = path.join(cwd, dirs[index], 'generated/messages.js');
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
		},
		async buildStart() {
			await build(logger, cwd, dirs);
		},
	};
}
