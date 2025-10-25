import type {
	ObjectSchema,
	OptionalSchema,
	PicklistSchema,
	RecordSchema,
	StringSchema,
} from 'valibot';

import type { Message } from '@sveltevietnam/i18n-new';

export type MessageQueryInput<
	MessageMap extends Record<string, Message>,
	Language extends string,
	Key extends keyof MessageMap,
> = {
	lang: Language;
	key: Key;
} & (MessageMap[Key]['$t'] extends 'with-params'
	? {
			params: MessageMap[Key]['$$p'];
		}
	: Record<never, never>);

export function createMessageQueryFn<
	MessageMap extends Record<string, Message>,
	Language extends string,
>(
	modules: Record<string, () => Promise<unknown>>,
): <Key extends keyof MessageMap>(
	inputs: MessageQueryInput<MessageMap, Language, Key>[],
) => Promise<(input: MessageQueryInput<MessageMap, Language, Key>) => string>;

export type MessageQueryFn<
	MessageMap extends Record<string, Message>,
	Language extends string,
> = ReturnType<typeof createMessageQueryFn<MessageMap, Language>>;

export function createMessageQueryInputSchema<Language extends string>(
	languages: ReadonlyArray<Language>,
): MessageQueryInputSchema<Language>;

export type MessageQueryInputSchema<Language extends string> = ObjectSchema<
	{
		readonly key: StringSchema<undefined>;
		readonly lang: PicklistSchema<readonly Language[], undefined>;
		readonly params: OptionalSchema<
			RecordSchema<StringSchema<undefined>, StringSchema<undefined>, undefined>,
			undefined
		>;
	},
	undefined
>;
