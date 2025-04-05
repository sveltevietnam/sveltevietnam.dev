import fs from 'node:fs/promises';
import path from 'node:path/posix';

import pico from 'picocolors';

import { collectYamls } from './internals/collect.js';
import { lint } from './internals/lint.js';
import { transform } from './internals/transform.js';
import { printLintIssues } from './internals/utils.js';

/**
 * @typedef Config
 * @property {string} input - directory path for the input locale files
 * @property {string} [output] - file path for the output message JS module
 */

/**
 * @param {string} cwd
 * @param {Config} config
 * @returns {Promise<Record<string, Record<string, string>>>} message map
 */
async function process(cwd, config) {
	const { input, output = path.join(input, 'generated/messages.js') } = config;

	// 1. collect
	console.info(pico.blue(`[sveltevietnam-i18n] Collecting locale files at "${input}"...`));
	const yamls = await collectYamls(cwd, input);

	// 2. parse & lint
	const { messages, issuesByKey } = await lint(yamls, false);
	const issueEntries = Object.entries(issuesByKey);
	if (issueEntries.length) {
		console.error(pico.redBright(`[sveltevietnam-i18n] ${issueEntries.length} issue(s) found`));
		printLintIssues(issueEntries);
		console.error(
			pico.redBright('[sveltevietnam-i18n] Skipping build for now... Please fix the issues first.'),
		);
		return messages;
	}

	// 3. build
	const module = transform(messages);

	const outPath = path.join(cwd, output);
	await fs.mkdir(path.dirname(outPath), { recursive: true });
	await fs.writeFile(outPath, module);
	console.info(
		pico.green(
			`[sveltevietnam-i18n] Successfully built ${pico.bold(Object.keys(messages).length)} messages to "${output}"`,
		),
	);

	return messages;
}

/**
 * @param {Config} config
 * @returns {import('vite').Plugin}
 */
export function i18n(config) {
	return {
		name: 'sveltevietnam-i18n',
		enforce: 'post',
		async configureServer(server) {
			const cwd = server.config.root;
			const inputDir = path.join(cwd, config.input);

			/** @param {string} filepath */
			function onUpdate(filepath) {
				if (path.dirname(filepath) === inputDir && path.extname(filepath) === '.yaml') {
					console.info(
						pico.blue(
							`[sveltevietnam-i18n] detecting changes at "${path.relative(cwd, filepath)}", rebuilding...`,
						),
					);
					process(cwd, config);
				}
			}

			await process(cwd, config);

			server.watcher.add(path.join(inputDir, '*.yaml'));
			server.watcher.on('add', onUpdate);
			server.watcher.on('change', onUpdate);
			server.watcher.on('unlink', onUpdate);
		},
	};
}
