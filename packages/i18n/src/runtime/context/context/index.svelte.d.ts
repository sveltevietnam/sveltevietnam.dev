import type { Message, InferParams, InferLanguage, InferType } from '../../types.public';

export class Context<
	Mode extends 'static' | 'remote' = import('@sveltevietnam/i18n/generated').Mode,
	Language extends string = import('@sveltevietnam/i18n/generated').Language,
	Mapping extends Record<string, Message> = import('@sveltevietnam/i18n/generated').Mapping,
> {
	constructor(init: () => ContextInit<Language>);
	readonly lang: Language;
	readonly t: Mode extends 'static' ? StaticTranslate : RemoteTranslate<Language, Mapping>;
	readonly sanitize: (content: string) => string;
	static readonly KEY: unique symbol;
	static get(): Context;
	static set(init: () => ContextInit): Context;
}

export interface ContextInit<
	Language extends string = import('@sveltevietnam/i18n/generated').Language,
> {
	lang: Language;
	sanitize?: (content: string) => string;
}

export interface TranslateOptions<Language extends string> {
	lang: Language;
	sanitize: (content: string) => string;
}

export interface RemoteTranslate<
	Language extends string = import('@sveltevietnam/i18n/generated').Language,
	Mapping extends Record<string, Message> = import('@sveltevietnam/i18n/generated').Mapping,
> {
	<Key extends keyof Mapping>(
		input: {
			key: Key;
			options?: Partial<TranslateOptions<Language>>;
		} & (InferType<Mapping[Key]> extends 'with-params'
			? {
					params: InferParams<Mapping[Key]>;
				}
			: Record<never, never>),
	): Promise<string>;
}

export interface StaticTranslate {
	<M extends Message>(
		input: {
			message: M;
			options?: Partial<TranslateOptions<InferLanguage<M>>>;
		} & (InferType<M> extends 'with-params'
			? {
					params: InferParams<M>;
				}
			: Record<never, never>),
	): string;
}
