import fs from 'node:fs/promises';
import path from 'node:path/posix';

import pico from 'picocolors';
import glob from 'tiny-glob';
import { createLogger } from 'vite';

import { collectYamls } from './internals/collect.js';
import { lint } from './internals/lint.js';
import { flatParseMessages } from './internals/parse.js';
import { transform } from './internals/transform.js';
import { printLintIssues } from './internals/utils.js';

/**
 * @typedef Config
 * @property {string} input - glob pattern for the directories containing locale files
 */

/**
 * @param {import('vite').Logger} logger
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
		if (issueEntries.length) {
			hasIssue = true;
			logger.error(
				pico.redBright(
					`[sveltevietnam-i18n] ${issueEntries.length} issue(s) found in "${path.relative(cwd, dirs[i])}" for the following message(s):`,
				),
			);
			printLintIssues(issueEntries, logger);
		}
	}
	if (hasIssue) {
		logger.error(
			pico.redBright('[sveltevietnam-i18n] Skipping build for now... Please fix the issues first.'),
		);
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
	logger.info(
		pico.green(
			`[sveltevietnam-i18n] successfully ${rebuild ? 'rebuilt' : 'built'} ${pico.bold(numMessages)} messages`,
		),
	);
}

/**
 * @typedef PluginContext
 * @property {string} cwd
 * @property {string[]} dirs
 */

/**
 * @param {Config} config
 * @returns {import('vite').Plugin}
 */
export function i18n(config) {
	const logger = createLogger();
	let cwd = process.cwd();
	/** @type {string[]} */
	let dirs = [];

	return {
		name: 'sveltevietnam-i18n',
		enforce: 'pre',
		async options() {
			cwd = process.cwd();
			dirs = await glob(config.input, { cwd });
		},
		async configureServer(server) {
			/** @param {string} filepath */
			async function onUpdate(filepath) {
				if (path.extname(filepath) !== '.yaml') return;
				dirs = await glob(config.input, { cwd });

				const dir = path.relative(cwd, path.dirname(filepath));
				if (!dirs.includes(dir)) return;

				logger.info(
					pico.blue(
						`[sveltevietnam-i18n] detected changes at "${path.relative(cwd, filepath)}", rebuilding...`,
					),
				);
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
