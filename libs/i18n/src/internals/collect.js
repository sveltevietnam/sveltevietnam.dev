import path from 'node:path';

import glob from 'tiny-glob';

/**
 * @param {string} cwd
 * @param {string} pattern
 * @returns {Promise<import('./private.d.ts').LocaleDirectoryMap>}
 */
export async function collectLocaleDirMap(cwd, pattern) {
	const filepaths = await glob(pattern, { cwd });

	/** @type {import('./private.d.ts').LocaleDirectoryMap} */
	const map = new Map();

	for (const filepath of filepaths) {
		const dirpath = path.dirname(filepath);

		let dir = map.get(dirpath);
		if (!dir) {
			dir = {};
			map.set(dirpath, dir);
		}
		const lang = path.basename(filepath, '.json');
		dir[lang] = filepath;
	}

	return map;
}

