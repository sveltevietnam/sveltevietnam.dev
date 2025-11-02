import type { InferType, InferParams, Message } from '../../runtime/types.public';

export type MessageQueryInput<
	Mapping extends Record<string, Message>,
	Language extends string,
	Key extends keyof Mapping,
> = {
	lang: Language;
	key: Key;
} & (InferType<Mapping[Key]> extends 'with-params'
	? {
			params: InferParams<Mapping[Key]>;
		}
	: Record<never, never>);

export function createMessageQueryFn<
	Mapping extends Record<string, Message> = import('@sveltevietnam/i18n/generated').Mapping,
	Language extends string = import('@sveltevietnam/i18n/generated').Language,
>(
	modules: Record<string, () => Promise<unknown>>,
): <Key extends keyof Mapping>(
	inputs: MessageQueryInput<Mapping, Language, Key>[],
) => Promise<(input: MessageQueryInput<Mapping, Language, Key>) => string>;

export type MessageQueryFn<
	Mapping extends Record<string, Message> = import('@sveltevietnam/i18n/generated').Mapping,
	Language extends string = import('@sveltevietnam/i18n/generated').Language,
> = ReturnType<typeof createMessageQueryFn<Mapping, Language>>;
