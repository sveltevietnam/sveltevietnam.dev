import path from 'node:path';

import debounce from 'lodash.debounce';

import { buildAllLocales, rebuildLocales } from './internals/build.js';
import { collectLocaleDirMap } from './internals/collect.js';
import { LANGUAGES } from './language.js';

/**
 * @typedef Config
 * @property {string} dirname - directory basename where the locales are
 * @property {ReadonlyArray<string>} langs - list of languages
 * @property {string} defaultLang - default language
 */

/**
 * @returns {import('vite').Plugin}
 */
export function i18n() {
	/** @type {Config} */
	const config = {
		dirname: 'locales',
		langs: LANGUAGES,
		defaultLang: 'vi',
	};

	const pattern = `**/${config.dirname}/{${config.langs.join(',')}}.json`;

	return {
		name: 'sveltekit-i18n',
		enforce: 'post',
		async configureServer(server) {
			const cwd = server.config.root;
			const dirMap = await collectLocaleDirMap(cwd, pattern);

			await buildAllLocales(dirMap, config.langs, config.defaultLang);

			/** @type {Set<string>} */
			let updatedFilenameSet = new Set();

			const debounceRebuildLocales = debounce(
				async () => {
					await rebuildLocales(dirMap, Array.from(updatedFilenameSet), config.defaultLang);
					updatedFilenameSet.clear();
				},
				1000,
			);

			/** @param {string} filepath */
			function onUpdate(filepath) {
				const relpath = path.relative(cwd, filepath);
				const dirname =	path.basename(path.dirname(relpath));
				const ext = path.extname(relpath);
				const lang = path.basename(relpath, ext);

				if (
					ext !== '.json' ||
					!config.langs.includes(lang) ||
					dirname !== config.dirname
				) return;
				updatedFilenameSet.add(relpath);
				debounceRebuildLocales();
			}

			server.watcher.add(pattern);
			server.watcher.on('add', onUpdate);
			server.watcher.on('change', onUpdate);
		},
	};
}
