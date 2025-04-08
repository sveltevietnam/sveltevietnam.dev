#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path/posix';

import * as p from '@clack/prompts';
import { program } from 'commander';
import pico from 'picocolors';
import glob from 'tiny-glob';

import pkg from '../package.json' with { type: 'json' };

import { build } from './internals/build.js';
import { collectYamls } from './internals/collect.js';
import { lint } from './internals/lint.js';
import { printLintIssues } from './internals/utils.js';

program.name('i18n').description(pkg.description).version(pkg.version);

program
	.command('lint')
	.description('lint locale files for potential issues')
	.argument('<pattern>', 'glob pattern of directories containing all locale files (in yaml)')
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

				// globing
				spinner.start('Finding locale directories...');
				const dirs = await glob(pattern, { cwd });
				spinner.stop(`Found ${pico.green(pico.bold(dirs.length))} locale directories`);
				p.note(dirs.map((d) => path.relative(cwd, d)).join('\n'), 'Locale directories:');

				// collect
				spinner.start('Collecting locale files...');
				const localeFileGroups = await Promise.all(dirs.map((dir) => collectYamls(cwd, dir)));
				spinner.stop('Collected locale files...');

				// parse & lint
				spinner.start('Parsing and linting messages');
				// const { issuesByKey } = await lint(yamls, options['fail-first']);
				const issueGroups = await Promise.all(
					localeFileGroups.map(async (yamls) => lint(yamls, options['fail-first'])),
				);
				const numMessages = issueGroups.reduce((numMessages, group) => {
					return numMessages + Object.keys(group.messages).length;
				}, 0);
				spinner.stop(`Parsed and linted ${pico.green(pico.bold(numMessages))} messages`);

				// reporting
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
	.argument('<pattern>', 'glob pattern for directories containing all locale files (in yaml)')
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

				// globing
				spinner.start('Finding locale directories...');
				const dirs = await glob(pattern, { cwd });
				spinner.stop(`Found ${pico.green(pico.bold(dirs.length))} locale directories`);
				p.note(dirs.map((d) => path.relative(cwd, d)).join('\n'), 'Locale directories:');

				// collect
				spinner.start('Collecting locale files...');
				const localeFileGroups = await Promise.all(dirs.map((dir) => collectYamls(cwd, dir)));
				spinner.stop('Collected locale files...');

				// parse & transform
				spinner.start('Parsing and transforming messages...');
				const outputs = await Promise.all(localeFileGroups.map(async (yamls) => build(yamls)));
				const numMessages = outputs.reduce((numMessages, output) => {
					return numMessages + Object.keys(output.messages).length;
				}, 0);
				spinner.stop(`Parsed and transformed ${pico.green(pico.bold(numMessages))} messages`);

				// writing to filesystem
				const outputPaths = await Promise.all(
					outputs.map(async (output, index) => {
						const outPath = path.join(process.cwd(), dirs[index], 'generated/messages.js');
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
