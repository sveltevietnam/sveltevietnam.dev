import fs from 'node:fs/promises';
import path from 'node:path';

import glob from 'tiny-glob';

/**
 * @typedef {Record<string, string>} YamlByLang
 * where key is the language, value is the YAML string read from filesystem
 */

/**
 * @typedef {Record<string, YamlByLang>} YamlGroupByDir
 * where key is the directory, value is {@link YamlByLang}
 */

/**
 * @param {string} cwd - the current working directory
 * @param {string[]} dirs - the paths to locale directories
 * @returns {Promise<YamlGroupByDir>} where key is the language, value is the YAML string read from filesystem
 */
export async function collectYamlGroupByDir(cwd, dirs) {
	return Object.fromEntries(
		(
			await Promise.all(
				dirs.map(async (dir) => {
					const langYamls = await collectYamlByLang(cwd, dir);
					if (langYamls === null) {
						return null;
					}
					return [path.posix.join(cwd, dir), langYamls];
				}),
			)
		).filter((entry) => entry !== null),
	);
}

/**
 * @param {string} cwd - the current working directory
 * @param {string} dir - the directory to search for YAML files
 * @return {Promise<YamlByLang|null>}
 */
async function collectYamlByLang(cwd, dir) {
	const pattern = path.posix.join(dir.trim(), '*.yaml').trim();
	const filepaths = await glob(pattern, { cwd });
	if (filepaths.length === 0) {
		return null;
	}

	return Object.fromEntries(
		await Promise.all(
			filepaths.map(async (filepath) => {
				const lang =
					process.platform === 'win32'
						? path.win32.basename(filepath, '.yaml')
						: path.basename(filepath, '.yaml');
				const yaml = await fs.readFile(filepath, 'utf-8');
				return [lang, yaml];
			}),
		),
	);
}
