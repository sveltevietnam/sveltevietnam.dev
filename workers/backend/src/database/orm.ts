import { D1Database } from '@cloudflare/workers-types';
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';

import * as schema from './schema';

export type ORM = DrizzleD1Database<typeof schema>;

export function getOrm(d1: D1Database): ORM {
	return drizzle(d1, { schema });
}
