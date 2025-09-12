import { RpcTarget } from 'cloudflare:workers';
import { sql } from 'drizzle-orm';
import * as v from 'valibot';

import { ORM } from '$/database/orm';

import { EmployerSelectResult, EmployerSelectSchema } from './schema';
import { employers } from './tables';

export class EmployerService extends RpcTarget {
	#orm: ORM;
	#env: Env;

	constructor(orm: ORM, env: Env) {
		super();
		this.#orm = orm;
		this.#env = env;
	}

	async exists(email: string): Promise<boolean> {
		const { isExist } = await this.#orm.get<{ isExist: 0 | 1 }>(
			sql<number>`select exists(select 1 from ${employers} where ${employers.email} = ${email}) as isExist`,
		);
		return !!isExist;
	}

	async getByEmail(email: string): Promise<null | EmployerSelectResult> {
		const employer = await this.#orm.query.employers.findFirst({
			where: (table, { eq }) => eq(table.email, email),
		});
		return v.parse(EmployerSelectSchema, employer) ?? null;
	}

	async getLastAuthVerification(email: string): Promise<null | {
		createdAt: Date;
		expiresAt: Date;
	}> {
		const value = { email };
		const verification = await this.#orm.query.employerAuthVerifications.findFirst({
			columns: { createdAt: true, expiresAt: true },
			where: (table, { eq }) => eq(table.value, JSON.stringify(value)),
			orderBy: (table, { desc }) => [desc(table.expiresAt)],
		});
		return verification ?? null;
	}
}
