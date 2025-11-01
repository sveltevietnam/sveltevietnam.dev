import type { Language } from '@sveltevietnam/kit/constants';
import { EMAILS } from '@sveltevietnam/kit/constants';
import { formatTimeDiff } from '@sveltevietnam/kit/utilities/datetime';
import { RpcTarget } from 'cloudflare:workers';
import { eq, sql } from 'drizzle-orm';
import { ExecutionContext } from 'hono';
import * as v from 'valibot';

import { ORM } from '../../database/orm';
import { JwtService } from '../../jwt';
import { MailService } from '../mails';

import { JOB_POSTING_TYPE_I18N } from './enums';
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
	JobPostingSelectAllActiveResult,
	JobPostingSelectAllActiveSchema,
} from './schema';
import { jobPostings, STATUS_SQL } from './tables';

export class JobPostingService extends RpcTarget {
	#orm: ORM;
	#env: Env;
	#ctx: ExecutionContext;
	#jwt: JwtService;
	#mails: MailService;

	constructor(orm: ORM, env: Env, ctx: ExecutionContext, jwt: JwtService, mails: MailService) {
		super();
		this.#orm = orm;
		this.#env = env;
		this.#ctx = ctx;
		this.#jwt = jwt;
		this.#mails = mails;
	}

	async getAllActive(): Promise<JobPostingSelectAllActiveResult[]> {
		const jobPostingsList = await this.#orm.query.jobPostings.findMany({
			where: (table, { isNull, isNotNull, and, gt }) =>
				and(
					gt(table.expiredAt, sql`(unixepoch() * 1000)`),
					isNotNull(table.approvedAt),
					isNull(table.deletedAt),
				),
			with: {
				employer: {
					columns: {
						image: true,
						name: true,
						website: true,
					},
				},
			},
			orderBy: (table, { desc }) => [desc(table.createdAt)],
		});
		return jobPostingsList.map((jp) => v.parse(JobPostingSelectAllActiveSchema, jp));
	}

	async getAllByEmployerId(employerId: string): Promise<JobPostingSelectResult[]> {
		const jobPostingsList = await this.#orm.query.jobPostings.findMany({
			extras: {
				status: STATUS_SQL.as('status'),
			},
			where: (table, { eq, and, isNull }) =>
				and(eq(table.employerId, employerId), isNull(table.deletedAt)),
			orderBy: (table, { desc }) => [desc(table.createdAt)],
		});
		return jobPostingsList.map((jp) => v.parse(JobPostingSelectSchema, jp));
	}

	async create(input: {
		posting: JobPostingInsertInput;
		lang: Language;
		placeholderPath: string;
	}): Promise<JobPostingInsertResult> {
		const parsed = v.safeParse(JobPostingInsertSchema, input.posting);
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

		// queue emails to employer & admin
		this.#ctx.waitUntil(
			(async () => {
				const employer = await this.#orm.query.employers.findFirst({
					columns: {
						name: true,
						email: true,
						website: true,
						image: true,
						description: true,
					},
					where: (table, { eq }) => eq(table.id, parsed.output.employerId),
				});
				if (!employer) return;

				const { RECRUIT_URL, ORIGIN } = this.#env;
				const token = await this.#jwt.sign({
					sub: 'admin',
					posting: id,
					iat: Math.floor(Date.now() / 1000),
					exp: Math.floor(parsed.output.expiredAt.getTime() / 1000),
				});

				return Promise.all([
					this.#mails.queue('recruit-employer-create-job-posting', {
						actorId: parsed.output.employerId,
						lang: input.lang,
						vars: {
							name: employer.name,
							jobTitle: parsed.output.title,
							jobUrl: RECRUIT_URL + input.placeholderPath.replace('placeholder', id),
						},
					}),
					this.#mails.queue('recruit-admin-job-posting-pending-approval', {
						email: EMAILS.JOBS,
						lang: input.lang,
						vars: {
							posting: {
								title: parsed.output.title,
								type: JOB_POSTING_TYPE_I18N[parsed.output.type][input.lang],
								location: parsed.output.location,
								salary: parsed.output.salary,
								expiration: `${parsed.output.expiredAt.toLocaleString('en', { timeZone: 'Asia/Ho_Chi_Minh' })} (${formatTimeDiff(parsed.output.expiredAt, new Date())})`,
								application: parsed.output.applicationLink,
								description: parsed.output.description,
							},
							employer: {
								name: employer.name,
								email: employer.email,
								website: employer.website,
								image: employer.image ? RECRUIT_URL + employer.image : null,
								description: employer.description,
							},
							approveEndpoint: `${ORIGIN}/${input.lang}/qap/${token}`,
						},
					}),
				]);
			})(),
		);

		return { success: true, id };
	}

	async getEmployerIdById(id: string): Promise<string | null> {
		const jobPosting = await this.#orm.query.jobPostings.findFirst({
			where: (table, { eq, and, isNull }) => and(eq(table.id, id), isNull(table.deletedAt)),
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
			extras: {
				status: STATUS_SQL.as('status'),
			},
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

	async approveById(id: string, lang: Language): Promise<boolean> {
		const posting = await this.#orm.query.jobPostings.findFirst({
			where: (table, { eq }) => eq(table.id, id),
			columns: { approvedAt: true, title: true },
			with: {
				employer: {
					columns: {
						id: true,
						name: true,
					},
				},
			},
		});
		if (!posting) return false;
		if (!posting.approvedAt) {
			const result = await this.#orm
				.update(jobPostings)
				.set({ approvedAt: new Date() })
				.where(eq(jobPostings.id, id))
				.returning({ employerId: jobPostings.employerId });
			if (!result.length) return false;

			const jobPublicUrl = `${this.#env.SITE_URL}/${lang}/${lang === 'en' ? 'jobs' : 'viec-lam'}/${id}`;
			await this.#mails.queue('recruit-employer-job-posting-approved', {
				actorId: posting.employer.id,
				lang,
				vars: {
					jobPublicUrl,
					jobTitle: posting.title,
					name: posting.employer.name,
				},
			});
		}

		return true;
	}
}
