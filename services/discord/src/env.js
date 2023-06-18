import dotenv from 'dotenv';
import fastifyPlugin from 'fastify-plugin';
import { z } from 'zod';

export const schema = z.object({
  DISCORD_TOKEN: z.string().nonempty(),
  DISCORD_APPLICATION_ID: z.string().nonempty(),
  DISCORD_PUBLIC_KEY: z.string().nonempty(),
  DISCORD_SVELTEVIETNAM_GUILD_ID: z.string().nonempty(),
  DISCORD_SVELTEVIETNAM_INVITE_URL: z.string().nonempty(),
  PORT: z.coerce.number(),
  MODE: z.enum(['development', 'production']),
});

export const FastifyEnv = fastifyPlugin(
  async function (fastify) {
    dotenv.config();
    const env = schema.parse(process.env);

    fastify.decorate('env', env);
    fastify.addHook('preHandler', async (request) => {
      request.env = env;
    });
  },
  {
    name: 'fastify-zod-env',
  },
);
