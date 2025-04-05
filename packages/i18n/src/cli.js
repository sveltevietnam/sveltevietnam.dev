#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path/posix';

import * as p from '@clack/prompts';
import { program } from 'commander';
import pico from 'picocolors';

import pkg from '../package.json' with { type: 'json' };

import { build } from './internals/build.js';
import { collectYamls } from './internals/collect.js';
import { lint } from './internals/lint.js';
import { printLintIssues } from './internals/utils.js';

program.name('i18n').description(pkg.description).version(pkg.version);

program
	.command('lint')
	.description('lint locale files for potential issues')
	.argument('<dir>', 'directory containing all locale files (in yaml)')
	.option('-f, --fail-first', 'whether to quit immediately on the first error', false)
	.action(
		/**
		 * @param {string} dir - the directory containing all locale files
		 * @param {{ 'fail-first'?: boolean }} options - the command line options
		 */
		async function (dir, options = {}) {
			try {
				p.intro(pico.bgCyan(pico.black(' i18n lint ')));
				const spinner = p.spinner();

				// collect
				spinner.start('Collecting locale files...');
				const cwd = process.cwd();
				const yamls = await collectYamls(cwd, dir);
				spinner.stop('Collected locale files...');

				// parse & lint
				spinner.start('Parsing and linting messages');
				const { issuesByKey } = await lint(yamls, options['fail-first']);
				spinner.stop('Parsed and linted messages');

				// reporting
				const issueEntries = Object.entries(issuesByKey);
				if (issueEntries.length) {
					p.note(pico.redBright(`${issueEntries.length} issue(s) found`));
					printLintIssues(issueEntries);
					return process.exit(1);
				}

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
	.argument('<dir>', 'directory containing all locale files (in yaml)')
	.option(
		'-o, --output <filepath>',
		'file to write the generated JS module source code to, if not specified will output to stdout',
	)
	.action(
		/**
		 * @param {string} dir - the directory containing all locale files
		 * @param {{ output?: string }} options - the command line options
		 * @returns {Promise<void>}
		 */
		async function (dir, options = {}) {
			try {
				p.intro(pico.bgCyan(pico.black(' i18n build ')));
				const spinner = p.spinner();

				// collect
				spinner.start('Collecting locale files...');
				const cwd = process.cwd();
				const yamls = await collectYamls(cwd, dir);
				spinner.stop('Collected locale files...');

				spinner.start('Parsing and transforming messages...');
				const output = await build(yamls);
				spinner.stop('Parsed and transformed all messages');

				if (!options.output) {
					p.outro(pico.green('All set!'));
					console.log(output.module);
					return process.exit(0);
				}

				const outPath = path.join(cwd, options.output);
				await fs.mkdir(path.dirname(outPath), { recursive: true });
				await fs.writeFile(outPath, output.module);
				p.note(outPath, 'Output');
				p.outro(pico.green('All set!'));

				return process.exit(0);
			} catch (e) {
				p.note(
					'It may be helpful to run the `lint` command to check for potential issues in your locale files.',
					pico.red('Failed to build the module'),
				);
				p.outro(pico.red('Something unexpected happened'));
				console.error(e);
				return process.exit(1);
			}
		},
	);

program.parse();
