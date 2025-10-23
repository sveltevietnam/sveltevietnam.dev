import { stdout } from 'node:process';

import { toJsonSchema } from '@valibot/to-json-schema';

import { RecursiveStringRecordSchema, LocaleSchema } from './locale.js';

const jsonSchema = toJsonSchema(LocaleSchema, {
	typeMode: 'input',
	definitions: { RecursiveStringRecordSchema },
});

stdout.write(JSON.stringify(jsonSchema, null, 2));
