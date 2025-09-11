import { RpcTarget } from 'cloudflare:workers';
import { sql } from 'drizzle-orm';

import { ORM } from '$/database/orm';

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
			sql`select exists(select 1 from employers where email = ${email}) as isExist`,
		);
		return !!isExist;
	}
}
