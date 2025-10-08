import { RpcTarget } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';

import { ORM } from '../../database/orm';

import { BlueskyPostSelectSchema, type BlueskyPostSelectResult } from './schema';
import { blueskyPosts } from './tables';

export class BlueskyPostService extends RpcTarget {
	#orm: ORM;

	constructor(orm: ORM) {
		super();
		this.#orm = orm;
	}

	async getByPostId(postId: string): Promise<BlueskyPostSelectResult | null> {
		const result = await this.#orm
			.select()
			.from(blueskyPosts)
			.where(eq(blueskyPosts.postId, postId))
			.execute();

		if (result.length === 0) {
			return null;
		}

		return v.parse(BlueskyPostSelectSchema, result[0]);
	}
}
