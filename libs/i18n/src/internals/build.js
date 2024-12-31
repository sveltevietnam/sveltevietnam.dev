import fs from 'node:fs/promises';
import path from 'node:path';

import * as codegen from './codegen.js';
import { parseLocale } from './parse.js';
import { transformLocale } from './transform.js';

/**
 * @param {import('./private.d.ts').LocaleDirectoryMap} dirMap
 * @param {ReadonlyArray<string>} langs
 * @param {string} defaultLang
 */
export async function buildAllLocales(dirMap, langs, defaultLang) {
	/** @type {import('./private.d.ts').BuildOutput}  */
	const outputs = {
		dirpaths: [],
		modules: [],
	};

	for (const [dirpath, locales] of dirMap.entries()) {
		const outDirPath = path.join(dirpath, 'generated');

		for (const [lang, filepath] of Object.entries(locales)) {
			const locale = await parseLocale(filepath);
			const code = transformLocale(locale, lang);

			outputs.modules.push({
				code,
				filepath: path.join(outDirPath, `${lang}.js`),
			});
		}

		outputs.modules.push({
			filepath: path.join(outDirPath, 'index.js'),
			code: codegen.makeLoaderModule(langs, defaultLang),
		});
		outputs.dirpaths.push(outDirPath);
	}

	await writeOutputs(outputs);
}

/**
 * @param {import('./private.d.ts').LocaleDirectoryMap} dirMap
 * @param {string[]} filepaths
 * @param {string} defaultLang
 */
export async function rebuildLocales(dirMap, filepaths, defaultLang) {
	/** @type {import('./private.d.ts').LocaleDirectoryMap} */
	const updatedDirPath = new Map();

	/** @type {import('./private.d.ts').BuildOutput}  */
	const outputs = {
		dirpaths: [],
		modules: [],
	};

	for (const filepath of filepaths) {
		const dirpath = path.dirname(filepath);
		const lang = path.basename(filepath, '.json');

		let dir = updatedDirPath.get(dirpath);
		if (!dir) {
			dir = {};
			updatedDirPath.set(dirpath, dir);
		}
		dir[lang] = filepath;

		// parse and transform
		const locale = await parseLocale(filepath);
		const code = transformLocale(locale, lang);

		outputs.modules.push({
			code,
			filepath: path.join(dirpath, 'generated', `${lang}.js`),
		});
	}

	for (const [dirpath, locales] of updatedDirPath.entries()) {
		const outDirPath = path.join(dirpath, 'generated');
		outputs.dirpaths.push(outDirPath);

		const updatedLangs = new Set(Object.keys(locales));
		const existingLangs = new Set(Object.keys(dirMap.get(dirpath) || {}));

		const allLangs = new Set([...updatedLangs, ...existingLangs]);
		if (updatedLangs.difference(existingLangs).size) {
			const updatedDefaultLang = allLangs.has(defaultLang) ? defaultLang : Array.from(allLangs)[0];
			outputs.modules.push({
				filepath: path.join(outDirPath, 'index.js'),
				code: codegen.makeLoaderModule(Array.from(allLangs), updatedDefaultLang),
			});
		}

		const existingLocales = dirMap.get(dirpath);
		if (!existingLocales) {
			dirMap.set(dirpath, locales);
		} else {
			dirMap.set(dirpath, { ...existingLocales, ...locales });
		}
	}

	await writeOutputs(outputs);
}

/**
 * @param {import('./private.d.ts').LocaleDirectoryMap} dirMap
 * @param {string[]} filepaths
 * @param {string} defaultLang
 */
export async function removeLocales(dirMap, filepaths, defaultLang) {
	/** @type {import('./private.d.ts').BuildOutput}  */
	const outputs = {
		dirpaths: [],
		modules: [],
	};
	/** @type {string[]} */
	const removals = [];

	/** @type {Map<string, string[]>}*/
	const removedDirMap = new Map();

	for (const filepath of filepaths) {
		const dirpath = path.dirname(filepath);
		const lang = path.basename(filepath, '.json');

		removals.push(path.join(dirpath, 'generated', `${lang}.js`));
		let dir = removedDirMap.get(dirpath);
		if (!dir) {
			dir = [];
			removedDirMap.set(dirpath, dir);
		}
		dir.push(lang);
	}

	for (const [dirpath, locales] of dirMap.entries()) {
		if (!removedDirMap.has(dirpath)) continue;
		for (const lang of removedDirMap.get(dirpath) ?? []) {
			delete locales[lang];
		}
		if (Object.keys(locales).length === 0) {
			dirMap.delete(dirpath);
			removals.push(path.join(dirpath, 'generated', 'index.js'));
		} else {
			const allLangs = Object.keys(locales);
			const updatedDefaultLang = allLangs.includes(defaultLang) ? defaultLang : allLangs[0];
			outputs.modules.push({
				filepath: path.join(dirpath, 'generated', 'index.js'),
				code: codegen.makeLoaderModule(allLangs, updatedDefaultLang),
			});
		}
	}

	await writeOutputs(outputs);
	await Promise.all(removals.map((filepath) => fs.rm(filepath)));
}

/**
 * @param {import('./private.d.ts').BuildOutput} outputs
 */
async function writeOutputs(outputs) {
	await Promise.all(outputs.dirpaths.map((dirpath) => fs.mkdir(dirpath, { recursive: true })));
	await Promise.all(
		outputs.modules.map(({ filepath, code }) => fs.writeFile(filepath, code, 'utf-8')),
	);
}
