import { Client, GatewayIntentBits } from 'discord.js';

import { DiscordBot } from './discord.bot.js';
import { DiscordWebsocket } from './discord.websocket.js';

/**
 * @typedef {import('@fastify/websocket').SocketStream} SocketStream
 * @typedef {import('discord.js').ClientEvents} ClientEvents
 */

export class DiscordService {
  /** @type {Client} */
  #client;

  /** @type {string} */
  #token;

  /** @type {import('fastify').FastifyBaseLogger} */
  #logger;

  /** @type {DiscordBot} */
  bot;

  /** @type {DiscordWebsocket} */
  websocket;

  /**
   * @param {string} token
   * @param {import('fastify').FastifyBaseLogger} logger
   */
  constructor(token, logger) {
    this.#token = token;
    this.#logger = logger;
    this.#client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
      ],
    });
    this.#client.login(this.#token);
    this.bot = new DiscordBot(this.#client);
    this.websocket = new DiscordWebsocket(this.#client);
  }

  destroy() {
    this.#client.destroy();
  }
}
