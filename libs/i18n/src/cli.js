import { program } from 'commander';
import pico from 'picocolors';

import pkg from '../package.json' with { type: 'json' };

import { collectLocaleDirMap } from './internals/collect.js';
import { lint } from './internals/lint.js';

program
	.name('i18n')
	.description(pkg.description)
	.version(pkg.version)

program
	.command('lint')
	.description('Lint all locale files for consistency issues')
	.option('--dirname', 'directory name for locale files', 'locales')
	.option('--langs', 'comma-separated list of supported languages', 'vi,en')
	.option('--default-lang <lang>', 'default language', 'vi')
	.action(async (options) => {
		const { dirname, defaultLang } = options;
		const langs = options.langs.split(',');

		const pattern = `**/${dirname}/{${langs.join(',')}}.json`;
		const dirMap = await collectLocaleDirMap(process.cwd(), pattern);

		const errors = await lint(dirMap, langs, defaultLang);

		const numErrors = Object.values(errors).reduce((acc, msgs) => acc + msgs.length, 0);
		if (!numErrors) {
			console.log(pico.green('No issues found. Nice work!'));
			process.exit(0);
		}
		else {
			console.error(pico.red(`${numErrors} issue(s) found:`));
			for (const [dirpath, messages] of Object.entries(errors)) {
				console.error(pico.red(`- ${dirpath}`));
				for (const message of messages) {
					console.error(pico.red(`  - ${message}`));
				}
			}
			process.exit(1);
		}
	})

program.parse();
