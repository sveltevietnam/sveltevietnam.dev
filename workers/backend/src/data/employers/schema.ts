import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import * as v from 'valibot';

import { employers } from './tables';

export const EmployerSelectSchema = createSelectSchema(employers, {
	id: v.optional(v.pipe(v.string(), v.startsWith('employer_'))),
});
export type EmployerSelectResult = v.InferOutput<typeof EmployerInsertSchema>;

export const EmployerInsertSchema = createInsertSchema(employers, {
	id: v.optional(v.pipe(v.string(), v.startsWith('employer_'))),
});
export type EmployerInsertInput = v.InferInput<typeof EmployerInsertSchema>;
export type EmployerInsertResult =
	| { success: true; id: string }
	| { success: false; errors: v.FlatErrors<typeof EmployerInsertSchema> };
