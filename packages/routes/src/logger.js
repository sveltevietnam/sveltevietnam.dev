/// FIXME: candidate for extraction to a reusable package
/// because this is also used in the i18n plugin

import pico from 'picocolors';
import { createLogger as createViteLoggger } from 'vite';

/**
 * @typedef {'success' | 'info' | 'warn' | 'error'} Status
 */

/**
 * @typedef {(colorize: typeof STATUS_TO_COLORIZE[keyof typeof STATUS_TO_COLORIZE]) => string} MessageBuilder
 */

/**
 * @typedef {import('vite').Logger & { internal: import('vite').Logger } & Record<Status, import('vite').Logger['info']>} CustomLogger
 */

const STATUS_TO_SYMBOL = /** @satisfies {Record<Status, string>} */ ({
	info: 'ⓘ',
	success: '✔',
	warn: '⚠',
	error: '✘',
});

const STATUS_TO_COLORIZE = /** @satisfies {Record<Status, typeof pico.red>} */ ({
	info: pico.cyan,
	success: pico.green,
	warn: pico.yellow,
	error: pico.red,
});

const STATUS_TO_PREFIX = /** @satisfies {Record<Status, [typeof pico.bgRed, typeof pico.red]>} */ ({
	info: [pico.bgCyanBright, pico.black],
	success: [pico.bgGreenBright, pico.black],
	warn: [pico.bgYellowBright, pico.black],
	error: [pico.bgRedBright, pico.black],
});

/**
 * @param {Status} status
 * @param {import('vite').Logger['info']} method
 * @return {import('vite').Logger['info']}
 */
function createProxyLogMethod(status, method) {
	return (message, options) => {
		const colorize = STATUS_TO_COLORIZE[status];
		const symbol = STATUS_TO_SYMBOL[status];
		const prefix = STATUS_TO_PREFIX[status];
		message = `${prefix[0](prefix[1](' sveltevietnam/routes '))} ${colorize(symbol)} ${message}`;
		return method(message, options);
	};
}

/**
 * @returns {CustomLogger}
 */
export function createLogger() {
	const logger = createViteLoggger('info', {
		allowClearScreen: true,
	});

	return {
		...logger,
		info: createProxyLogMethod('info', logger.info),
		success: createProxyLogMethod('success', logger.info),
		warn: createProxyLogMethod('warn', logger.warn),
		error: createProxyLogMethod('error', logger.error),
		internal: logger,
	};
}
