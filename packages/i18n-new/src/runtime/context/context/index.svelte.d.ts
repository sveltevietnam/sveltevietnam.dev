/* eslint-disable @typescript-eslint/no-explicit-any */

import { $$Runtime } from '@sveltevietnam/i18n-new/generated';

import { MessageSimple, MessageWithParams } from '../../types.public';

export class Context<
	Mode extends 'static' | 'remote' = ReturnType<$$Runtime>['mode'],
	Language extends string = ReturnType<$$Runtime>['languages'][number],
	Mapping extends Record<
		string,
		import('@sveltevietnam/i18n-new').Message
	> = ReturnType<$$Runtime>['mapping'],
> {
	constructor(init: () => ContextInit<Language>);
	lang: Language;
	t: Mode extends 'static' ? StaticTranslate : RemoteTranslate<Language, Mapping>;
	sanitize: (content: string) => string;
	static get(): Context;
	static set(init: () => ContextInit): Context;
}

export interface ContextInit<Language extends string = ReturnType<$$Runtime>['languages'][number]> {
	lang: Language;
	sanitize?: (content: string) => string;
}

export interface TranslateOptions<Language extends string> {
	lang: Language;
	sanitize: (content: string) => string;
}

export interface RemoteTranslate<
	Language extends string = ReturnType<$$Runtime>['languages'][number],
	Mapping extends Record<
		string,
		import('@sveltevietnam/i18n-new').Message
	> = ReturnType<$$Runtime>['mapping'],
> {
	<K extends NonNullable<Extract<Mapping[keyof Mapping], { $t: 'simple' }>['$t']>>(input: {
		key: K;
		options?: Partial<TranslateOptions<Language>>;
	}): Promise<string>;
	<K extends NonNullable<Extract<Mapping[keyof Mapping], { $t: 'with-params' }>['$t']>>(input: {
		key: K;
		params: Mapping[K]['$$p'];
		options?: Partial<TranslateOptions<Language>>;
	}): Promise<string>;
}

export interface StaticTranslate {
	<M extends MessageSimple<any, any>>(input: {
		message: M;
		options?: Partial<TranslateOptions<M['$$l']>>;
	}): string;
	<M extends MessageWithParams<any, any, any>>(input: {
		message: M;
		params: M['$$p'];
		options?: Partial<TranslateOptions<M['$$l']>>;
	}): string;
}
