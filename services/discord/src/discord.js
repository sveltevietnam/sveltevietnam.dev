import { Client, GatewayIntentBits, Events } from 'discord.js';
import fastifyPlugin from 'fastify-plugin';
import { v4 as uuidv4 } from 'uuid';

/**
 * @typedef {import('@fastify/websocket').SocketStream} SocketStream
 * @typedef {import('discord.js').ClientEvents} ClientEvents
 */

export class DiscordService extends Client {
  /**
   * @type {Record<string, SocketStream>}
   */
  #connections;
  /**
   * @type {string}
   */
  #token;
  /**
   * @type {import('fastify').FastifyBaseLogger}
   */
  #logger;

  /**
   * @param {string} token
   * @param {import('fastify').FastifyBaseLogger} logger
   */
  constructor(token, logger) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
      ],
    });
    this.#connections = {};
    this.#token = token;
    this.#logger = logger;
    super.login(this.#token);
  }

  get idle() {
    return Object.values(this.#connections).length === 0;
  }

  mountEvents() {
    super.on(Events.GuildMemberAdd, this.onGuildMemberAdd);
    super.on(Events.MessageCreate, this.onMessageCreate);
  }

  unmountEvents() {
    super.off(Events.GuildMemberAdd, this.onGuildMemberAdd);
    super.off(Events.MessageCreate, this.onMessageCreate);
  }

  /**
   *
   * @param {ClientEvents[Events.GuildMemberAdd]} args
   */
  onGuildMemberAdd(...[member]) {
    for (const connection of Object.values(this.#connections)) {
      const payload = { type: Events.GuildMemberAdd, data: member };
      connection.socket.send(JSON.stringify(payload));
    }
  }

  /**
   *
   * @param {ClientEvents[Events.MessageCreate]} args
   */
  async onMessageCreate(...[message]) {
    if (!message.author.bot) {
      for (const connection of Object.values(this.#connections)) {
        const payload = { type: Events.MessageCreate, data: message };
        connection.socket.send(JSON.stringify(payload));
      }
    }
  }

  /**
   *
   * @param {SocketStream} connection
   */
  connect(connection) {
    if (this.idle) this.mountEvents();
    const id = uuidv4();
    this.#connections[id] = connection;

    connection.socket.on('close', () => {
      delete this.#connections[id];
      if (this.idle) this.unmountEvents();
    });
  }
}

export const FastifyDiscord = fastifyPlugin(
  async function (fastify) {
    const discord = new DiscordService(fastify.env.DISCORD_TOKEN, fastify.log);
    fastify
      .decorate('discord', discord)
      .addHook('preHandler', async (request) => {
        request.discord = discord;
      })
      .addHook('onClose', async () => {
        await discord.destroy();
      });
  },
  {
    name: 'fastify-discord',
  },
);
