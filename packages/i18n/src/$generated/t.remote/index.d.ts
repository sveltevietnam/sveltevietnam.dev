import type { InferParams, InferType, Message } from '@sveltevietnam/i18n';
import type { Key, Language, Mapping } from '@sveltevietnam/i18n/generated';

export function query<
	M extends Record<string, Message> = Mapping,
	L extends string = Language,
	K extends keyof Mapping = Key,
>(
	input: {
		key: K;
		lang: L;
	} & (InferType<M[K]> extends 'with-params'
		? {
				params: InferParams<M[K]>;
			}
		: Record<never, never>),
): Promise<string>;
