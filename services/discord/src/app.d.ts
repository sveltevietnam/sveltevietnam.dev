import * as fastify from 'fastify';
import type z from 'zod';

import type { schema } from './env';

type EnvSchema = z.infer<typeof schema>;

declare module 'fastify' {
  interface FastifyInstance {
    env: EnvSchema;
  }
  interface FastifyRequest extends FastifyRequest {
    env: EnvSchema;
  }
}
