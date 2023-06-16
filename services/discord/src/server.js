import FastifyEnv from '@fastify/env';
import FastifyHelmet from '@fastify/helmet';
import FastifyWebsocket from '@fastify/websocket';
import { Client, GatewayIntentBits, Events } from 'discord.js';
import Fastify from 'fastify';
import { v4 as uuidv4 } from 'uuid';

const fastify = Fastify({
  logger: true,
});

await fastify
  .register(FastifyEnv, {
    dotenv: true,
    schema: {
      type: 'object',
      required: [
        'DISCORD_TOKEN',
        'DISCORD_APPLICATION_ID',
        'DISCORD_PUBLIC_KEY',
        'DISCORD_SVELTEVIETNAM_GUILD_ID',
        'DISCORD_SVELTEVIETNAM_INVITE_URL'
      ],
      properties: {
        DISCORD_TOKEN: {
          type: 'string',
        },
        DISCORD_APPLICATION_ID: {
          type: 'string',
        },
        DISCORD_PUBLIC_KEY: {
          type: 'string',
        },
        DISCORD_SVELTEVIETNAM_GUILD_ID: {
          type: 'string',
        },
        DISCORD_SVELTEVIETNAM_INVITE_URL: {
          type: 'string',
        },
      },
    },
  })
  .register(FastifyHelmet)
  .register(FastifyWebsocket);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
  ],
});
const connections = {};

client.login(fastify.config.DISCORD_TOKEN);
client.on(Events.ClientReady, () => {
  console.log('ready');
});
client.on(Events.MessageCreate, message => {
  const { author, guildId } = message;
  console.log(guildId);
  if (!author.bot) return;
  if (guildId !== fastify.config.DISCORD_SVELTEVIETNAM_GUILD_ID) return;
  for (const connection of Object.values(connections)) {
    connection.socket.send(JSON.stringify({
      type: 'message',
      data: {
        id: message.id,
        content: message.content,
      },
    }));
  }
});

fastify.get('/', async (request, reply) => {
  reply.redirect(301, fastify.config.DISCORD_SVELTEVIETNAM_INVITE_URL);
});
fastify.get('/websocket', { websocket: true }, (connection) => {
  const id = uuidv4();
  connections[id] = connection;
  connection.socket.on('close', () => {
    delete connections[id];
  });
});

/**
 * Run the server!
 */
try {
  await fastify.listen({ port: 5006 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
