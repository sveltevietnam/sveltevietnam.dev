import sanitizeHtml from 'sanitize-html';
import { getContext, setContext } from 'svelte';

import { mode } from '@sveltevietnam/i18n/generated/constants';

/**
 * @param {string} content
 * @returns {string}
 */
function defaultSanitize(content) {
	return sanitizeHtml(content, {
		allowedAttributes: {
			'*': ['class', 'id', 'data-*'],
			a: ['href', 'target', 'rel'],
		},
	});
}

/**
 * @template {'static' | 'remote'} [Mode=import('@sveltevietnam/i18n/generated').Mode]
 * @template {string} [Language=import('@sveltevietnam/i18n/generated').Language]
 * @template {Record<string, import('@sveltevietnam/i18n').Message>} [Mapping=import('@sveltevietnam/i18n/generated').Mapping]
 */
export class Context {
	static KEY = Symbol('i18n');

	/** @type {() => import('./index.svelte').ContextInit<Language>} */
	#getter = () => ({ lang: /** @type {Language} */ ('en') });

	/** @type {import('./index.svelte').Context<Mode, Language, Mapping>['lang']} */
	lang = $derived.by(() => this.#getter().lang);
	/** @type {import('./index.svelte').Context<Mode, Language, Mapping>['sanitize']} */
	sanitize = $derived.by(() => this.#getter().sanitize ?? defaultSanitize);

	/** @type {import('./index.svelte').Context<Mode, Language, Mapping>['t']} */
	t =
		/** @type {(input: any) => any} */
		(
			(input) => {
				const { key, message, params, options } = input || {};
				if (mode === 'static' && !message) {
					throw new Error(
						'(sveltevietnam/i18n) ✘ T component in "static" mode requires "message" prop',
					);
				}
				if (mode === 'remote') {
					if (!key && !message) {
						throw new Error(
							'(sveltevietnam/i18n) ✘ T component in "remote" mode requires "key" prop',
						);
					} else if (!key) {
						if (!('window' in globalThis)) {
							console.warn(
								'\x1b[43m sveltevietnam/i18n ⚠ \x1b[0m',
								'\x1b[33m T component is in remote mode but received "message" prop; optimize by passing "key" prop instead \x1b[0m',
							);
						}
					}
				}

				const { lang, sanitize } =
					/** @type {import('./index.svelte').TranslateOptions<Language>} */ (options ?? {});
				const rLang = lang ?? this.lang;
				const rSanitize = sanitize ?? this.sanitize;

				if (mode === 'static' || (!key && message)) {
					return rSanitize(message(rLang, params));
				}

				return import('@sveltevietnam/i18n/generated/t.remote')
					.then((mod) => mod.query({ key, lang: rLang, params }))
					.then((text) => rSanitize(text));
			}
		);

	/** @param {() => import('./index.svelte').ContextInit<Language>} init */
	constructor(init) {
		this.#getter = init;
	}

	/**
	 * @param {() => import('./index.svelte').ContextInit} init
	 * @returns {import('./index.svelte').Context}
	 */
	static set(init) {
		return setContext(Context.KEY, new Context(init));
	}

	/** @returns {import('./index.svelte').Context} */
	static get() {
		return getContext(Context.KEY);
	}
}
