/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
	Message,
	MessageSimple,
	MessageWithParams,
	InferKey,
	InferParams,
	InferLanguage,
} from '../../types.public';

export class Context<
	Mode extends 'static' | 'remote' = import('@sveltevietnam/i18n-new/generated').Mode,
	Language extends string = import('@sveltevietnam/i18n-new/generated').Language,
	Mapping extends Record<string, Message> = import('@sveltevietnam/i18n-new/generated').Mapping,
> {
	constructor(init: () => ContextInit<Language>);
	lang: Language;
	t: Mode extends 'static' ? StaticTranslate : RemoteTranslate<Language, Mapping>;
	sanitize: (content: string) => string;
	static get(): Context;
	static set(init: () => ContextInit): Context;
}

export interface ContextInit<
	Language extends string = import('@sveltevietnam/i18n-new/generated').Language,
> {
	lang: Language;
	sanitize?: (content: string) => string;
}

export interface TranslateOptions<Language extends string> {
	lang: Language;
	sanitize: (content: string) => string;
}

export interface RemoteTranslate<
	Language extends string = import('@sveltevietnam/i18n-new/generated').Language,
	Mapping extends Record<string, Message> = import('@sveltevietnam/i18n-new/generated').Mapping,
> {
	<K extends InferKey<Mapping, 'simple'>>(input: {
		key: K;
		options?: Partial<TranslateOptions<Language>>;
	}): Promise<string>;
	<K extends InferKey<Mapping, 'with-params'>>(input: {
		key: K;
		params: InferParams<Mapping[K]>;
		options?: Partial<TranslateOptions<Language>>;
	}): Promise<string>;
}

export interface StaticTranslate {
	<M extends MessageSimple<any, any>>(input: {
		message: M;
		options?: Partial<TranslateOptions<InferLanguage<M>>>;
	}): string;
	<M extends MessageWithParams<any, any, any>>(input: {
		message: M;
		params: InferParams<M>;
		options?: Partial<TranslateOptions<InferLanguage<M>>>;
	}): string;
}
