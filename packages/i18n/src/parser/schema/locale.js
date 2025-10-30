import * as v from 'valibot';

/** @type {v.GenericSchema<import('../../utils/recursive-record').RecursiveRecord<string>>} */
export const RecursiveStringRecordSchema = v.record(
	v.string(),
	v.union([v.string(), v.lazy(() => RecursiveStringRecordSchema)]),
);
export const LocaleSchema = v.pipe(
	v.object({
		messages: v.pipe(
			RecursiveStringRecordSchema,
			v.metadata({
				description: 'A recursive record of locale messages',
			}),
		),
	}),
	v.metadata({
		title: 'I18N Locale Definition',
		description: 'Schema for parsing i18n messages from locale files',
	}),
);
