import sanitizeHtml from 'sanitize-html';
import { getContext, setContext } from 'svelte';

// @ts-expect-error alias set up by vite plugin
import { mode } from '$i18n/constants.js';

/**
 * @param {string} content
 * @returns {string}
 */
function defaultSanitize(content) {
	return sanitizeHtml(content, {
		allowedAttributes: {
			'*': ['class', 'data-*'],
			a: ['href', 'target', 'rel'],
		},
	});
}

/**
 * @template {'static' | 'remote'} [Mode=import('@sveltevietnam/i18n-new/generated').Mode]
 * @template {string} [Language=import('@sveltevietnam/i18n-new/generated').Language]
 * @template {Record<string, import('@sveltevietnam/i18n-new').Message>} [Mapping=import('@sveltevietnam/i18n-new/generated').Mapping]
 */
export class Context {
	static KEY = Symbol('i18n');

	/** @type {import('./index.svelte').Context<Mode, Language, Mapping>['lang']} */
	lang = $state(/** @type {Language} */ ('en'));
	/** @type {import('./index.svelte').Context<Mode, Language, Mapping>['sanitize']} */
	sanitize = $state(defaultSanitize);

	/** @type {import('./index.svelte').Context<Mode, Language, Mapping>['t']} */
	t =
		/** @type {(input: any) => any} */
		(
			(input) => {
				const { key, message, params, options } = input || {};
				if (mode === 'static' && !message) {
					throw new Error(
						'(sveltevietnam/i18n-new) ✘ T component in "static" mode requires "message" prop',
					);
				}
				if (mode === 'remote') {
					if (!key && !message) {
						throw new Error(
							'(sveltevietnam/i18n-new) ✘ T component in "remote" mode requires "key" prop',
						);
					} else if (!key) {
						if (!('window' in globalThis)) {
							console.warn(
								'\x1b[43m sveltevietnam/i18n-new ⚠ \x1b[0m',
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

				// @ts-expect-error alias set up by vite plugin
				return import('$i18n/t.remote.js')
					.then((mod) => mod.t({ key, lang: rLang, params }))
					.then((text) => rSanitize(text));
			}
		);

	/** @param {() => import('./index.svelte').ContextInit<Language>} init */
	constructor(init) {
		// run in both SSR and browser
		this.#update(init());

		//  update in browser
		$effect(() => {
			this.#update(init());
		});
	}

	/** @param {import('./index.svelte').ContextInit<Language>} init */
	#update(init) {
		const { lang, sanitize } = init;
		this.lang = lang;
		this.sanitize = sanitize ?? defaultSanitize;
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
