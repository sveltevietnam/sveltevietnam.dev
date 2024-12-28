import fs from 'node:fs/promises';
import path from 'node:path';

import glob from 'tiny-glob';
import { string, object, record, parse } from 'valibot';

import { LANGUAGES } from '../language.js';

import * as codegen from './codegen.js';
import * as utils from './utils.js';

/**
 * @typedef {import('valibot').InferInput<typeof LocaleSchema>} Locale
 */

/**
 * @typedef {Record<string, Record<string, Locale>>} LocaleDirectoryRecord
 */

const LocaleSchema = object({
	module: string(),
	messages: record(string(), string()),
});

/**
 * STEP 1
 * Collect and parse locale directories
 * @param {string} cwd - root directory
 * @param {string} pattern - glob pattern for locale files
 * @param {ReadonlyArray<string>} langs - list of supported languages
 * @returns {Promise<LocaleDirectoryRecord>}
 */
async function parseDirs(cwd, pattern, langs) {
	console.log('[sveltekit-i18n] parsing locale directories...');
	const filepaths = await glob(pattern, { cwd });

	/// 1 - collect locale directories
	/**
	 * @type {Record<string, Record<string, string>>}
	 */
	const dirs = {};
	for (const filepath of filepaths) {
		const outdir = path.dirname(filepath);

		if (!dirs[outdir]) dirs[outdir] = {};
		const lang = path.basename(filepath, '.json');
		dirs[outdir][lang] = filepath;
	}

	/// 2 - check for missing locales
	for (const dir of Object.values(dirs)) {
		const userLangs = Object.keys(dir);
		if (langs.length !== userLangs.length) {
			const missingLangs = Array.from(new Set(langs).difference(new Set(userLangs)));
			throw new Error(`Missing ${Array.from(missingLangs)} in ${dir}`);
		}
	}

	/// 3 - parse locales files and check for module consistency & collision
	/** @type {LocaleDirectoryRecord} */
	const localeDirs = {};

	/** @type {Map<string, string>} */
	const modules = new Map();
	for (const [dirpath, files] of Object.entries(dirs)) {
		localeDirs[dirpath] = {};

		/** @type {string | null}*/
		let module = null;
		for (const lang of langs) {
			const filepath = files[lang];
			const locale = /** @type {Locale} */ (JSON.parse(await fs.readFile(filepath, 'utf-8')));
			parse(LocaleSchema, locale);

			if (!module) {
				module = locale.module;

				// check for module collision
				const existingNamespace = modules.get(module);
				if (existingNamespace) {
					throw new Error(`Duplicate module "${module}" in ${existingNamespace} and ${filepath}`);
				}
				modules.set(module, filepath);
			}

			// check for module consistency
			if (module !== locale.module) {
				throw new Error(
					`Inconsistent module in ${dirpath}. All locale in the same directory must share one unique module`,
				);
			}

			localeDirs[dirpath][lang] = locale;
		}
	}

	return localeDirs;
}

/**
 * @typedef LocaleModule
 * @property {string} path - path to the locale directory
 * @property {string} code - generated source code
 */

/**
 * @typedef BuildOutput
 * @property {LocaleModule[]} modules - generated locale modules
 * @property {string[]} outdirs - list of output directories to mkdir
 */

/**
 * STEP 2
 * transform locale JSON into JS modules and TS types
 * @param {LocaleDirectoryRecord} dirs
 * @param {ReadonlyArray<string>} langs
 * @param {string} defaultLang
 * @returns {BuildOutput}
 */
function build(dirs, langs, defaultLang) {
	console.log('[sveltekit-i18n] building locale modules...');
	/** @type {BuildOutput} */
	const output = {
		outdirs: [],
		modules: [],
	};

	for (const [dirpath, locales] of Object.entries(dirs)) {
		const outDirPath = path.join(dirpath, 'generated');

		for (const [lang, locale] of Object.entries(locales)) {
			/** @type {import('typescript').Node[]} */
			const exports = [];

			/** @type {Parameters<typeof import('./codegen').importRuntimeFactoryFunctions>} */
			let runtimeImportFlags = [false, false, false];

			for (const [key, content] of Object.entries(locale.messages)) {
				/** @type {import('../runtime').MessageType} */
				let type = 'string';
				if (utils.containsHtml(content)) type = 'snippet';
				else if (utils.containsParameters(content)) type = 'function';

				switch (type) {
					case 'string':
						runtimeImportFlags[0] = true;
						exports.push(...codegen.exportMessageString(key, content));
						break;
					case 'function':
						runtimeImportFlags[1] = true;
						exports.push(...codegen.exportMessageFunction(key, content));
						break;
					case 'snippet':
						runtimeImportFlags[2] = true;
						exports.push(...codegen.exportMessageSnippet(key, content));
						break;
				}
			}

			/** @type {import('typescript').Node[]} */
			const imports = codegen.importRuntimeFactoryFunctions(...runtimeImportFlags);
			if (runtimeImportFlags[2]) {
				imports.push(...codegen.importSvelteSnippetUtil());
			}

			output.modules.push({
				path: path.join(outDirPath, `${lang}.js`),
				code: codegen.print([...imports, codegen.newline(), ...exports], lang),
			});
		}

		output.modules.push({
			path: path.join(outDirPath, 'index.js'),
			code: codegen.makeLoaderModule(langs, defaultLang)
		})

		output.outdirs.push(outDirPath);
	}

	return output;
}

/**
 * @returns {import('vite').Plugin}
 */
export function sveltekitI18N() {
	const config = {
		dir: 'locales',
		langs: LANGUAGES,
		defaultLang: 'vi',
	};

	return {
		name: 'sveltekit-i18n',
		enforce: 'post',
		async configureServer(server) {
			const root = server.config.root;

			const pattern = path.join(root, '**', config.dir, `{${config.langs.join(',')}}.json`);

			const dirs = await parseDirs(root, pattern, config.langs);
			const { modules, outdirs } = build(dirs, config.langs, config.defaultLang);
			await Promise.all(outdirs.map((dir) => fs.mkdir(dir, { recursive: true })));
			await Promise.all(modules.map(({ path, code }) => fs.writeFile(path, code, 'utf-8')));
		},
	};
}
