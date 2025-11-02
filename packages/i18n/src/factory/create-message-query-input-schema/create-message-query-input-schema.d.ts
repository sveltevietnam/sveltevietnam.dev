import type {
	ObjectSchema,
	OptionalSchema,
	PicklistSchema,
	RecordSchema,
	StringSchema,
} from 'valibot';

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
