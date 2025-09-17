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
	JobPostingUpdateSchema,
	type JobPostingSelectResult,
	JobPostingSelectSchema,
	type JobPostingSelectWithEmployerResult,
	JobPostingSelectWithEmployerSchema,
} from './schema';
import { jobPostings } from './tables';

export class JobPostingService extends RpcTarget {
	#orm: ORM;

	constructor(orm: ORM) {
		super();
		this.#orm = orm;
	}

	async getByEmployerId(employerId: string): Promise<JobPostingSelectResult[]> {
		const jobPostingsList = await this.#orm.query.jobPostings.findMany({
			where: (table, { eq }) => eq(table.employerId, employerId),
			orderBy: (table, { desc }) => [desc(table.createdAt)],
		});
		return jobPostingsList.map((jp) => v.parse(JobPostingSelectSchema, jp));
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

	async getEmployerIdById(id: string): Promise<string | null> {
		const jobPosting = await this.#orm.query.jobPostings.findFirst({
			where: (table, { eq }) => eq(table.id, id),
			columns: { employerId: true },
		});
		if (!jobPosting) return null;
		return jobPosting.employerId;
	}

	async getById(
		id: string,
		employerId?: string,
	): Promise<null | JobPostingSelectWithEmployerResult> {
		const jobPosting = await this.#orm.query.jobPostings.findFirst({
			where: (table, { eq, and }) =>
				employerId ? and(eq(table.id, id), eq(table.employerId, employerId)) : eq(table.id, id),
			with: {
				employer: {
					columns: {
						name: true,
						image: true,
						website: true,
						description: true,
					},
				},
			},
		});
		if (!jobPosting) return null;
		return v.parse(JobPostingSelectWithEmployerSchema, jobPosting);
	}

	async updateById(id: string, input: JobPostingUpdateInput): Promise<JobPostingUpdateResult> {
		const parsed = v.safeParse(JobPostingUpdateSchema, input);
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
			.update(jobPostings)
			.set({ deletedAt: new Date() })
			.where(eq(jobPostings.id, id))
			.returning({ id: jobPostings.id });
		if (!result.length) return false;
		return true;
	}
}
