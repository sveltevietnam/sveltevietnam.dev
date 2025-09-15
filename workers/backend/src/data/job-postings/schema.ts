import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-valibot';
import * as v from 'valibot';

import { EmployerSelectSchema } from '../employers/schema';

import { jobPostings } from './tables';

export const JobPostingSelectSchema = v.object({
	...createSelectSchema(jobPostings, {
		id: v.pipe(v.string(), v.startsWith('job_')),
	}).entries,
	employer: v.object({
		name: EmployerSelectSchema.entries.name,
		image: EmployerSelectSchema.entries.image,
		website: EmployerSelectSchema.entries.website,
	}),
});
export type JobPostingSelectResult = v.InferOutput<typeof JobPostingSelectSchema>;

export const JobPostingInsertSchema = createInsertSchema(jobPostings, {
	id: v.optional(v.pipe(v.string(), v.startsWith('job_'))),
});
export type JobPostingInsertInput = v.InferInput<typeof JobPostingInsertSchema>;
export type JobPostingInsertResult =
	| { success: true; id: string }
	| { success: false; errors: v.FlatErrors<typeof JobPostingInsertSchema> };

export const JobPostingUpdateSchema = createUpdateSchema(jobPostings, {
	id: v.optional(v.pipe(v.string(), v.startsWith('job_'))),
});
export type JobPostingUpdateInput = v.InferInput<typeof JobPostingUpdateSchema>;
export type JobPostingUpdateResult =
	| { success: true }
	| { success: false; errors: v.FlatErrors<typeof JobPostingUpdateSchema> };
