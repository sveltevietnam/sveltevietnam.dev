import path from 'node:path';

import debounce from 'lodash.debounce';

import { buildAllLocales, rebuildLocales, removeLocales } from './internals/build.js';
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

			console.log('[sveltekit-i18n] Building all locales...');
			await buildAllLocales(dirMap, config.langs, config.defaultLang);

			/**
			 * @param {string} filepath
			 * @returns {boolean}
			 */
			function isLocaleFilepath(filepath) {
				const dirname = path.basename(path.dirname(filepath));
				const ext = path.extname(filepath);
				const lang = path.basename(filepath, ext);

				return (
					ext === '.json' &&
					config.langs.includes(lang) &&
					dirname === config.dirname
				);
			}

			/** @type {Set<string>} */
			let updatedFilepathSet = new Set();
			const debounceRebuildLocales = debounce(
				async () => {
					console.log('[sveltekit-i18n] Detected changes in locale files. Rebuilding some...');
					await rebuildLocales(dirMap, Array.from(updatedFilepathSet), config.defaultLang);
					updatedFilepathSet.clear();
				},
				1000,
			);
			/** @param {string} filepath */
			function onUpdate(filepath) {
				const relpath = path.relative(cwd, filepath);
				if (!isLocaleFilepath(relpath)) return;
				updatedFilepathSet.add(relpath);
				debounceRebuildLocales();
			}

			/** @type {Set<string>} */
			const removedFilepathSet = new Set();
			const debounceRemoveLocales = debounce(
				async () => {
					console.log('[sveltekit-i18n] Detected removal of locale files. Rebuilding some...');
					await removeLocales(dirMap, Array.from(removedFilepathSet), config.defaultLang);
					removedFilepathSet.clear();
				},
				1000,
			);

			/** @param {string} filepath */
			function onUnlink(filepath) {
				const relpath = path.relative(cwd, filepath);
				if (!isLocaleFilepath(relpath)) return;
				removedFilepathSet.add(relpath);
				debounceRemoveLocales();
			}

			server.watcher.add(pattern);
			server.watcher.on('add', onUpdate);
			server.watcher.on('change', onUpdate);
			server.watcher.on('unlink', onUnlink);
		},
	};
}
