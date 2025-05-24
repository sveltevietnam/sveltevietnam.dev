import { createSelectSchema } from 'drizzle-valibot';
import * as v from 'valibot';

import { blueskyPosts } from './table';

export const BlueskyPostSelectSchema = createSelectSchema(blueskyPosts);
export type BlueskyPostSelectResult = v.InferOutput<typeof BlueskyPostSelectSchema>;
