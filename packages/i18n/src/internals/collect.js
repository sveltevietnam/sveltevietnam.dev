import fs from 'node:fs/promises';
import path from 'node:path';

import glob from 'tiny-glob';

/**
 * @param {string} cwd - the current working directory
 * @param {string} dir - the directory containing all locale files
 * @returns {Promise<Record<string, string>>} where key is the language, value is the YAML string read from filesystem
 */
export async function collectYamls(cwd, dir) {
	const filepaths = await glob(path.join(dir, '*.yaml'), { cwd });
	if (filepaths.length === 0) {
		throw new Error(`No locale files found in ${dir}`);
	}

	return Object.fromEntries(
		await Promise.all(
			filepaths.map(async (filepath) => {
				const lang = path.basename(filepath, '.yaml');
				const yaml = await fs.readFile(filepath, 'utf-8');
				return [lang, yaml];
			}),
		),
	);
}
