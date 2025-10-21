// ===========
// Public API
// ===========
/**
 * collect parameters from a message string
 * @param {string} message - the input string to check
 * @returns {import('./types.public').MessageParameter[]} list of dynamic parameters, if any
 */
export function parseMessage(message) {
	/** @type {Record<string, import('./types.public').MessageParameter>} */
	const params = {};

	let start = message.indexOf('{{');
	while (start !== -1) {
		const end = message.indexOf('}}', start);
		if (end === -1) {
			throw new ErrorMissingCloseBracker(
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
export class ParseMessageError extends Error {
	/**
	 * populate by caller of `parseMessage` to point to source of error
	 * @type {{ file: string; key: string; } | undefined}
	 */
	cause;

	/**
	 * @param {string} message
	 * @param {string} [name]
	 */
	constructor(message, name = 'ParseMessageError') {
		super(message);
		this.name = name;
	}
}
export const ErrorMissingCloseBracker = createError('ErrorMissingCloseBracker');
export const ErrorInvalidParamName = createError('ErrorInvalidParamName');

// ==========
// Internals
// ==========

/** @param {string} name */
function createError(name) {
	return class extends ParseMessageError {
		/** @param {string} message  */
		constructor(message) {
			super(message, name);
		}
	};
}
