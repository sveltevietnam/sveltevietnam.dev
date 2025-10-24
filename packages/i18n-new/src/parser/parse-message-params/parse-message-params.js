// ===========
// Public API
// ===========
/**
 * collect parameters from a message string
 * @param {string} message - the input string to check
 * @returns {import('./types.public').MessageParameter[]} list of dynamic parameters, if any
 */
export function parseMessageParams(message) {
	/** @type {Record<string, import('./types.public').MessageParameter>} */
	const params = {};

	let start = message.indexOf('{{');
	while (start !== -1) {
		const end = message.indexOf('}}', start);
		if (end === -1) {
			throw new ErrorMissingCloseBracket(
				`Missing closing bracket "}}" for parameter "${message.slice(start + 2, start + 7)}..." starting at position ${start}`,
			);
		}
		const name = message.slice(start + 2, end);
		if (!/^\w+$/.test(name)) {
			throw new ErrorInvalidParamName(
				`Invalid parameter "${name}" at position ${start}. Parameter names must only contain alphanumeric characters and underscores.`,
			);
		}
		if (params[name]) {
			params[name].positions.push({ start, end: end + 2 });
		} else {
			params[name] = { name, positions: [{ start, end: end + 2 }] };
		}
		start = message.indexOf('{{', end);
	}

	return Object.values(params);
}

// =======
// Errors
// =======
export class ParseMessageParamsError extends Error {
	/**
	 * populate by caller of `parseMessage` to point to source of error
	 * @type {{ file: string; key: string; } | undefined}
	 */
	cause;

	/**
	 * @param {string} message
	 * @param {string} [name]
	 */
	constructor(message, name = 'ParseMessageParamsError') {
		super(message);
		this.name = name;
	}
}
export const ErrorMissingCloseBracket = createError('ErrorMissingCloseBracket');
export const ErrorInvalidParamName = createError('ErrorInvalidParamName');

// ==========
// Internals
// ==========

/** @param {string} name */
function createError(name) {
	return class extends ParseMessageParamsError {
		/** @param {string} message  */
		constructor(message) {
			super(message, name);
		}
	};
}
