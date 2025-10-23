import { readFileSync, existsSync } from 'node:fs';
import { isAbsolute } from 'node:path/posix';

import { resolve as importMetaResolve } from 'import-meta-resolve';
import * as v from 'valibot';

import { flattenRecursiveRecord } from '../../utils/recursive-record/flatten-recursive-record.js';
import { LocaleSchema } from '../schema/locale.js';

/**
 * @typedef ParseInternals
 * @property {{ file: string; key: string }[]} importTraces - set of visited file paths to prevent circular imports
 */

// ===========
// Public API
// ===========
/**
 * parse locale file into flat message map
 * @param {string} abspath - absolute path to yaml
 * @param {import('./types.public').ParseLocaleOptions} [options] - processing options
 * @returns {Promise<Record<string, string>>} - flat message map
 */
export async function parseLocale(abspath, options = {}) {
	// ---------------------
	// 1. Resolve options
	// ---------------------
	const rOptions =
		/** @type {import('./types.public').ParseLocaleOptions & { __internals__: ParseInternals }} */ (
			options
		);
	if (!rOptions.__internals__) {
		rOptions.__internals__ = { importTraces: [] };
	}
	const {
		rootKey = '',
		directive = {},
		__internals__: { importTraces },
	} = rOptions;
	const { import: directiveImport = '@import' } = directive;
	const deserializer = rOptions.deserializer ?? {
		parse: async ({ content }) => {
			const parseYAML = await import('yaml').then((mod) => mod.parse);
			return parseYAML(content);
		},
	};

	// --------------
	// 2. Parse file
	// --------------
	if (!isAbsolute(abspath)) {
		throw new ErrorExpectAbsolutePath(`Expect absolute path but received relative: "${abspath}"`);
	}
	const existed = existsSync(abspath);
	if (!existed) {
		let message = `File not found: "${abspath}"`;
		if (importTraces.length > 0) {
			const { file, key } = importTraces[importTraces.length - 1];
			message += ` (imported by "${file}" at "${key}")`;
		}
		throw new ErrorFileNotFound(message);
	}
	const str = readFileSync(abspath, 'utf-8');
	const deserialized = await deserializer.parse({ content: str.normalize(), file: abspath });
	const locale = v.parse(LocaleSchema, deserialized);
	const messages = flattenRecursiveRecord(locale.messages, {
		fallback: '',
		rootKey,
	});

	// ----------------------------------------
	// 3. Parse content for @import directives
	// ----------------------------------------
	/** @type {Promise<[key: string, message: string] | Record<string, string>>[]} */
	const asyncParsing = [];
	for (let [key, value] of Object.entries(messages)) {
		key = key.trim();
		value = value.trim();
		if (key.endsWith(directiveImport)) {
			/** @type {URL} */
			let url;
			try {
				url = new URL(importMetaResolve(value, new URL(abspath, 'file://').toString()));
			} catch (e) {
				if (/** @type {any} */ (e).code === 'ERR_MODULE_NOT_FOUND') {
					throw new ErrorFileNotFound(
						`Imported module not found: "${value}" (imported by "${abspath}" at "${key}")`,
					);
				}
				throw e;
			}
			const importPath = url.pathname;
			const lastIndex = importTraces.findIndex((trace) => trace.file === importPath);
			if (lastIndex !== -1) {
				const circularPath = [
					{ file: importPath, key },
					...importTraces.slice(lastIndex).toReversed(),
				]
					.map(({ file, key }) => `${file} (at "${key}")`)
					.join(' <- ');
				throw new ErrorCircularImport(`Circular import detected: ${circularPath}`);
			}
			importTraces.push({ file: importPath, key });
			asyncParsing.push(
				parseLocale(
					importPath,
					/** @type {typeof rOptions} */ ({
						...rOptions,
						rootKey: key.slice(0, -directiveImport.length - 1),
						__internals__: structuredClone(rOptions.__internals__),
					}),
				),
			);
		} else {
			asyncParsing.push(Promise.resolve([key, value]));
		}
	}

	// -----------------
	// 4. Merge results
	// -----------------
	const parsed = await Promise.all(asyncParsing);
	/** @type {Record<string, string>} */
	const merged = {};
	for (const item of parsed) {
		if (Array.isArray(item)) {
			const [key, value] = item;
			merged[key] = value;
		} else {
			Object.assign(merged, item);
		}
	}
	return merged;
}

// =======
// Errors
// =======
export class ParseLocaleError extends Error {
	/**
	 * @param {string} message
	 * @param {string} [name]
	 */
	constructor(message, name = 'ParseLocaleError') {
		super(message);
		this.name = name;
	}
}
export const ErrorFileNotFound = createError('ErrorFileNotFound');
export const ErrorExpectAbsolutePath = createError('ErrorExpectAbsolutePath');
export const ErrorCircularImport = createError('ErrorCircularImport');

// ==========
// Internals
// ==========

/** @param {string} name */
function createError(name) {
	return class extends ParseLocaleError {
		/** @param {string} message  */
		constructor(message) {
			super(message, name);
		}
	};
}
