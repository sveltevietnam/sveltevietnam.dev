import type z from 'zod';

import { DiscordService } from './discord';
import type { schema } from './env';

type EnvSchema = z.infer<typeof schema>;

declare module 'fastify' {
	interface FastifyInstance {
		env: EnvSchema;
		discord: DiscordService;
	}
	interface FastifyRequest extends FastifyRequest {
		env: EnvSchema;
		discord: DiscordService;
	}
}
