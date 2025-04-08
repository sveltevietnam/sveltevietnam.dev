#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path/posix';

import * as p from '@clack/prompts';
import { program } from 'commander';
import pico from 'picocolors';
import glob from 'tiny-glob';

import pkg from '../package.json' with { type: 'json' };

import { collectYamls } from './internals/collect.js';
import { lint } from './internals/lint.js';
import { flatParseMessages } from './internals/parse.js';
import { transform } from './internals/transform.js';
import { printLintIssues } from './internals/utils.js';

program.name('i18n').description(pkg.description).version(pkg.version);

program
	.command('lint')
	.description('lint locale files for potential issues')
	.argument('<pattern>', 'glob pattern of directories containing locale files (in yaml)')
	.option('-f, --fail-first', 'whether to quit immediately on the first error', false)
	.action(
		/**
		 * @param {string} pattern
		 * @param {{ 'fail-first'?: boolean }} options
		 */
		async function (pattern, options = {}) {
			try {
				const cwd = process.cwd();
				p.intro(pico.bgCyan(pico.black(' i18n lint ')));
				const spinner = p.spinner();

				// 1. Glob
				spinner.start('Finding locale directories...');
				const dirs = await glob(pattern, { cwd });
				spinner.stop(`Found ${pico.green(pico.bold(dirs.length))} locale directories`);
				p.note(dirs.map((d) => path.relative(cwd, d)).join('\n'), 'Locale directories:');

				// 2. Collect
				spinner.start('Collecting locale files...');
				const localeFileGroups = await Promise.all(dirs.map((dir) => collectYamls(cwd, dir)));
				spinner.stop('Collected locale files...');

				// 3. Parse
				spinner.start('Parsing messages...');
				const messageGroups = await Promise.all(
					localeFileGroups.map((yamls) => flatParseMessages(yamls)),
				);
				const numMessages = messageGroups.reduce((numMessages, group) => {
					return numMessages + Object.keys(group.messages).length;
				}, 0);
				spinner.stop(`Parsed ${pico.green(pico.bold(numMessages))} messages...`);

				// 4. Lint
				spinner.start('Linting messages');
				const issueGroups = await Promise.all(
					messageGroups.map(({ messages, langs }) => lint(messages, langs, options['fail-first'])),
				);
				spinner.stop(`Linted messages`);

				// 5. Report
				let hasIssue = false;
				for (let i = 0; i < issueGroups.length; i++) {
					const issueEntries = Object.entries(issueGroups[i].issuesByKey);
					if (issueEntries.length) {
						hasIssue = true;
						console.error(
							pico.redBright(
								`${issueEntries.length} issue(s) found in "${path.relative(cwd, dirs[i])}" for the following message(s):`,
							),
						);
						printLintIssues(issueEntries);
					}
				}
				if (hasIssue) return process.exit(1);

				p.outro(pico.green('No issues found. Nice work!'));
				return process.exit(0);
			} catch (e) {
				p.outro(pico.red('Something unexpected happened'));
				console.error(e);
				return process.exit(1);
			}
		},
	);

program
	.command('build')
	.description('attempt to build a JS module from locale files')
	.argument('<pattern>', 'glob pattern for directories containing locale files (in yaml)')
	.action(
		/**
		 * @param {string} pattern
		 * @returns {Promise<void>}
		 */
		async function (pattern) {
			try {
				const cwd = process.cwd();
				p.intro(pico.bgCyan(pico.black(' i18n build ')));
				const spinner = p.spinner();

				// 1. Glob
				spinner.start('Finding locale directories...');
				const dirs = await glob(pattern, { cwd });
				spinner.stop(`Found ${pico.green(pico.bold(dirs.length))} locale directories`);
				p.note(dirs.map((d) => path.relative(cwd, d)).join('\n'), 'Locale directories:');

				// 2. Collect
				spinner.start('Collecting locale files...');
				const localeFileGroups = await Promise.all(dirs.map((dir) => collectYamls(cwd, dir)));
				spinner.stop('Collected locale files...');

				// 3. Parse
				spinner.start('Parsing messages...');
				const messageGroups = await Promise.all(
					localeFileGroups.map((yamls) => flatParseMessages(yamls)),
				);
				const numMessages = messageGroups.reduce((numMessages, group) => {
					return numMessages + Object.keys(group.messages).length;
				}, 0);
				spinner.stop(`Parsed ${pico.green(pico.bold(numMessages))} messages...`);

				// 4. Transform
				spinner.start('Transforming messages...');
				const outputs = await Promise.all(
					messageGroups.map(async (group) => transform(group.messages)),
				);
				spinner.stop(`Transformed messages`);

				// 5. Write
				const outputPaths = await Promise.all(
					outputs.map(async (output, index) => {
						const outPath = path.join(cwd, dirs[index], 'generated/messages.js');
						await fs.mkdir(path.dirname(outPath), { recursive: true });
						await fs.writeFile(outPath, output.module);
						return outPath;
					}),
				);

				p.note(outputPaths.map((p) => path.relative(cwd, p)).join('\n'), 'Output modules:');
				p.outro(pico.green('All set!'));

				return process.exit(0);
			} catch (e) {
				p.note(
					'It may be helpful to run the `lint` command to check for issues in your locale files.',
					pico.red('Failed to build the module'),
				);
				p.outro(pico.red('Something unexpected happened'));
				console.error(e);
				return process.exit(1);
			}
		},
	);

program.parse();
