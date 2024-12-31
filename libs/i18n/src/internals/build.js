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

	await Promise.all(outputs.dirpaths.map((dirpath) => fs.mkdir(dirpath, { recursive: true })));
	await Promise.all(
		outputs.modules.map(({ filepath, code }) => fs.writeFile(filepath, code, 'utf-8')),
	);
}
