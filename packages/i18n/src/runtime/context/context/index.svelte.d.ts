import type { Language, Mode, Mapping } from '@sveltevietnam/i18n/generated';

import type { Message, InferParams, InferLanguage, InferType } from '../../types.public';

/**
 * the i18n context object, containing information about the current lang
 * and global instruction on how to translate messages based on the current build mode
 */
export class Context<
	Mo extends 'static' | 'remote' = Mode,
	L extends string = Language,
	Ma extends Record<string, Message> = Mapping,
> {
	constructor(init: () => ContextInit<Mo, L, Ma>);
	readonly lang: L;
	readonly t: Mo extends 'static' ? StaticTranslate : RemoteTranslate<L, Ma>;
	readonly sanitize: (content: string) => string;
	readonly remote: Mo extends 'remote'
		? 'query' | 'remote' | CompatibleRemoteFunction<L, Ma>
		: undefined;
	static readonly KEY: unique symbol;
	static get(): Context;
	static set(init: () => ContextInit): Context;
}

/** initial configuration for this i18n context */
export type ContextInit<
	Mo extends 'static' | 'remote' = Mode,
	L extends string = Language,
	Ma extends Record<string, Message> = Mapping,
> = Partial<Pick<TranslateOptions<Mo, L, Ma>, 'sanitize'>> & {
	/**
	 * the current language of the app,
	 * updates to this prop should propagate to all `T.svelte` instances
	 */
	lang: L;
} & (Mo extends 'remote'
		? Pick<TranslateOptions<'remote', L, Ma>, 'remote'>
		: Record<never, never>);

/** options to `t` function from i18n context */
export type TranslateOptions<
	Mo extends 'static' | 'remote' = Mode,
	L extends string = Language,
	Ma extends Record<string, Message> = Mapping,
> = {
	/** override lang that would otherwise inherit from nearest `Provider` */
	lang: L;
	/**
	 * a custom function to sanitize the message content,
	 * default: strip all attributes except `id`, `class` and `data-*`,
	 * or `href`, `target`, and `rel` for `a` anchor tags.
	 * @default import('sanitize-html').default
	 */
	sanitize: (content: string) => string;
} & (Mo extends 'remote'
	? {
			/**
			 * choose whether to use the `query` or `prerender` remote function, or provide your own
			 * - `query`: use `query.batch` underneath, more dynamic, but may not be cached
			 * - `prerender`: use `prerender` underneath, can be cached, but no batching
			 *
			 * @default `prerender`
			 */
			remote: 'query' | 'prerender' | CompatibleRemoteFunction<L, Ma>;
		}
	: Record<never, never>);

/** `t` function interface in "static" mode */
export interface StaticTranslate<Ma extends Record<string, Message> = Mapping> {
	<Me extends Ma[keyof Ma]>(
		input: {
			/**
			 * the message to render, typically imported from your generated i18n module,
			 * if the message is defined with parameters, pass them via the `params` field
			 *
			 * @example
			 * ```svelte
			 * <script lang="ts">
			 *  import { Context } from '@sveltevietnam/i18n'
			 *  import * as m from '@sveltevietnam/i18n/generated/messages';
			 *
			 *  const { t } = Context.get();
			 * </script>
			 *
			 * <input placeholder={t({ message: m['key.to.simple.message'] })} />
			 * <input placeholder={t({ message: m['key.to.message.with.params'], params: { foo: 'bar' } })} />
			 * ```
			 */
			message: Me;
		} & Partial<TranslateOptions<'static', InferLanguage<Me>, Ma>> &
			(InferType<Me> extends 'with-params'
				? {
						/**
						 * parameters to inject into message. You are seeing this because you have
						 * passed in a message field with `MessageWithParams` interface.
						 */
						params: InferParams<Me>;
					}
				: Record<never, never>),
	): string;
}

/** `t` function interface in "remote" mode */
export interface RemoteTranslate<
	L extends string = Language,
	Ma extends Record<string, Message> = Mapping,
> {
	<Key extends keyof Ma>(
		input: {
			/**
			 * key to the message to fetch, type of this key should key should be automatically augmented
			 * via the generated `<output-dir>/i18n.d.ts` file after the vite plugin has run;
			 * if the message is defined with parameters, pass them via the `params` field
			 *
			 * @example
			 * ```svelte
			 * <script lang="ts">
			 *  import { Context } from '@sveltevietnam/i18n'
			 *
			 *  const { t } = Context.get();
			 * </script>
			 *
			 * <input placeholder={t({ key: 'key.to.simple.message' })} />
			 * <input placeholder={t({ key: 'key.to.message.with.params', params: { foo: 'bar' } })} />
			 * ```
			 */
			key: Key;
		} & Partial<TranslateOptions<'remote', L, Ma>> &
			(InferType<Ma[Key]> extends 'with-params'
				? {
						/**
						 * parameters to inject into message. You are seeing this because you have
						 * passed in a key that refer to a message with `MessageWithParams` interface.
						 */
						params: InferParams<Ma[Key]>;
					}
				: Record<never, never>),
	): Promise<string>;
}

export interface CompatibleRemoteFunction<
	L extends string = Language,
	Ma extends Record<string, Message> = Mapping,
> {
	<K extends keyof Ma>(
		input: {
			key: K;
			lang: L;
		} & (InferType<Ma[K]> extends 'with-params'
			? {
					params: InferParams<Ma[K]>;
				}
			: Record<never, never>),
	): Promise<string>;
}
