import { Events } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * @typedef {import('@fastify/websocket').SocketStream} SocketStream
 * @typedef {import('discord.js').ClientEvents} ClientEvents
 * @typedef {import('discord.js').Client} Client
 */

/**
 * @template {keyof ClientEvents} K
 * @typedef {(...args: ClientEvents[K]) => import('discord.js').Awaitable<void>} ClientEventHandler
 */

/**
 * Listen for events from Svelte Vietnam discord guild
 * and send websocket messages to active clients on sveltevietnam.dev
 */
export class DiscordWebsocket {
  /** @param {Client} client */
  #client;
  /** @type {Record<string, SocketStream>} */
  #connections;

  /** @type {ClientEventHandler<Events.GuildMemberAdd>} */
  #onGuildMemberAdd;
  /** @type {ClientEventHandler<Events.MessageCreate>} */
  #onMessageCreate;

  /**
   * @param {Client} client
   */
  constructor(client) {
    this.#client = client;
    this.#connections = {};

    this.#onGuildMemberAdd = (member) => {
      for (const connection of Object.values(this.#connections)) {
        const payload = { type: Events.GuildMemberAdd, data: member };
        connection.socket.send(JSON.stringify(payload));
      }
    };

    this.#onMessageCreate = (message) => {
      if (!message.author.bot) {
        for (const connection of Object.values(this.#connections)) {
          const payload = { type: Events.MessageCreate, data: message };
          connection.socket.send(JSON.stringify(payload));
        }
      }
    };
  }

  get idle() {
    return Object.values(this.#connections).length === 0;
  }

  #mountEvents() {
    this.#client.on(Events.GuildMemberAdd, this.#onGuildMemberAdd);
    this.#client.on(Events.MessageCreate, this.#onMessageCreate);
  }

  #unmountEvents() {
    this.#client.off(Events.GuildMemberAdd, this.#onGuildMemberAdd);
    this.#client.off(Events.MessageCreate, this.#onMessageCreate);
  }

  /**
   *
   * @param {SocketStream} connection
   */
  connect(connection) {
    if (this.idle) this.#mountEvents();
    const id = uuidv4();
    this.#connections[id] = connection;

    connection.socket.on('close', () => {
      delete this.#connections[id];
      if (this.idle) this.#unmountEvents();
    });
  }
}
