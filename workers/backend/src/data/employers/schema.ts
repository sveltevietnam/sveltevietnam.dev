import { createSelectSchema } from 'drizzle-valibot';
import * as v from 'valibot';

import { employers } from './tables';

export const EmployerSelectSchema = createSelectSchema(employers, {
	id: v.optional(v.pipe(v.string(), v.startsWith('employer_'))),
});
export type EmployerSelectResult = v.InferOutput<typeof EmployerSelectSchema>;
