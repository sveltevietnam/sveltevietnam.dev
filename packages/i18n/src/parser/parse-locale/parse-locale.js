import { readFileSync, existsSync } from 'node:fs';
import os from 'node:os';
import { isAbsolute, win32 } from 'node:path';
import { pathToFileURL } from 'node:url';

import { resolve as importMetaResolve } from 'import-meta-resolve';
import * as v from 'valibot';

import { flattenRecursiveRecord } from '../../utils/recursive-record/flatten-recursive-record.js';
import { parseMessageParams } from '../parse-message-params/index.js';
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
 * @returns {Promise<import('./types.public').ParseLocaleOutput>} - flat message map
 */
export async function parseLocale(abspath, options = {}) {
	// ---------------------
	// 1. Resolve options
	// ---------------------
	const rOptions =
		/** @type {import('./types.public').ParseLocaleOptions & { __internals__: ParseInternals }} */ ({
			...options,
		});
	if (!rOptions.__internals__) {
		rOptions.__internals__ = { importTraces: [] };
	}
	const {
		rootKey = '',
		__internals__: { importTraces },
	} = rOptions;
	const { directive: importDirective = '@import', alias: importAlias = [] } = rOptions.import ?? {};
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
	if (os.platform() === 'win32') {
		abspath = win32.resolve(abspath);
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
	// TODO: catch error by valibot and enhance with message to include file path
	const locale = v.parse(LocaleSchema, deserialized);
	const messagesPerCurrentSource = flattenRecursiveRecord(locale.messages, {
		fallback: '',
		rootKey,
	});

	// ----------------------------------------
	// 3. Parse content for @import directives
	// ----------------------------------------
	/** @type {Set<string>} */
	let dependencies = new Set();
	/** @type {Promise<[Omit<import('./types.public').SourceMessage, 'params'>] | import('./types.public').ParseLocaleOutput>[]} */
	const asyncParsing = [];
	for (let [key, value] of Object.entries(messagesPerCurrentSource)) {
		key = key.trim();
		value = value.trim();
		if (key.endsWith(importDirective)) {
			/** @type {URL} */
			let url;
			try {
				if (importAlias.length) {
					for (const { find, replacement } of importAlias) {
						value = value.replace(find, replacement);
					}
				}
				url = new URL(importMetaResolve(value, pathToFileURL(abspath).toString()));
			} catch (e) {
				if (/** @type {any} */ (e).code === 'ERR_MODULE_NOT_FOUND') {
					throw new ErrorFileNotFound(
						`Imported module not found: "${value}" (imported by "${abspath}" at "${key}")`,
					);
				}
				throw e;
			}
			let importPath = decodeURIComponent(url.pathname);
			if (os.platform() === 'win32' && importPath.startsWith('/')) {
				importPath = win32.resolve(importPath.slice(1));
			}
			const lastIndex = importTraces.findIndex((trace) => trace.file === importPath);
			if (lastIndex !== -1) {
				const circularPath = [{ file: abspath, key }, ...importTraces.slice(lastIndex).toReversed()]
					.map(({ file, key }) => `${file} (at "${key}")`)
					.join(' <- ');
				throw new ErrorCircularImport(`Circular import detected: ${circularPath}`);
			}
			importTraces.push({ file: abspath, key });
			dependencies.add(importPath);
			asyncParsing.push(
				parseLocale(
					importPath,
					/** @type {typeof rOptions} */ ({
						...rOptions,
						rootKey: key.slice(0, -importDirective.length - 1),
						__internals__: structuredClone(rOptions.__internals__),
					}),
				),
			);
		} else {
			asyncParsing.push(
				Promise.resolve([
					{
						key,
						content: value,
						sources: [{ file: abspath, content: value }],
					},
				]),
			);
		}
	}

	// -----------------
	// 4. Merge results
	// -----------------
	const dependencyParses = await Promise.all(asyncParsing);

	/** @type {Record<string, Omit<import('./types.public').SourceMessage, 'params'>>} */
	const mergedMap = {};
	for (const item of dependencyParses) {
		if (Array.isArray(item)) {
			mergedMap[item[0].key] = item[0];
		} else {
			for (const message of item.messages) {
				const existingMessage = mergedMap[message.key];
				dependencies = dependencies.union(item.dependencies);
				if (existingMessage) {
					existingMessage.sources.push(...message.sources);
					existingMessage.content = message.content;
				} else {
					mergedMap[message.key] = message;
				}
			}
		}
	}

	// ----------------------------------
	// 5. Parse params for each messages
	// ----------------------------------
	/** @type {import('./types.public').SourceMessage[]} */
	const messages = Object.values(mergedMap).map((msg) => ({
		...msg,
		params: parseMessageParams(msg.content),
	}));

	return { messages, dependencies };
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
