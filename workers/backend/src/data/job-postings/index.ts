import { RpcTarget } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';

import { ORM } from '$/database/orm';

import {
	type JobPostingInsertInput,
	type JobPostingInsertResult,
	JobPostingInsertSchema,
	type JobPostingUpdateResult,
	type JobPostingUpdateInput,
	JobPostingSelectSchema,
	type JobPostingSelectResult,
} from './schema';
import { jobPostings } from './tables';

export class JobPostingService extends RpcTarget {
	#orm: ORM;

	constructor(orm: ORM) {
		super();
		this.#orm = orm;
	}

	async insert(input: JobPostingInsertInput): Promise<JobPostingInsertResult> {
		const parsed = v.safeParse(JobPostingInsertSchema, input);
		if (!parsed.success) {
			return {
				success: false,
				errors: v.flatten(parsed.issues),
			};
		}
		const [{ id }] = await this.#orm
			.insert(jobPostings)
			.values(parsed.output)
			.returning({ id: jobPostings.id });
		return { success: true, id };
	}

	async getById(id: string): Promise<null | JobPostingSelectResult> {
		const jobPosting = await this.#orm.query.jobPostings.findFirst({
			where: (table, { eq }) => eq(table.id, id),
			with: {
				employer: {
					columns: {
						name: true,
						image: true,
						website: true,
					},
				},
			},
		});
		if (!jobPosting) return null;
		return v.parse(JobPostingSelectSchema, jobPosting);
	}

	async updateById(id: string, input: JobPostingUpdateInput): Promise<JobPostingUpdateResult> {
		const parsed = v.safeParse(JobPostingInsertSchema, input);
		if (!parsed.success) {
			return {
				success: false,
				errors: v.flatten(parsed.issues),
			};
		}
		await this.#orm
			.update(jobPostings)
			.set(parsed.output)
			.where(eq(jobPostings.id, id))
			.returning({ id: jobPostings.id });
		return { success: true };
	}

	async deleteById(id: string): Promise<boolean> {
		const result = await this.#orm
			.delete(jobPostings)
			.where(eq(jobPostings.id, id))
			.returning({ id: jobPostings.id });
		if (!result.length) return false;
		return true;
	}
}
