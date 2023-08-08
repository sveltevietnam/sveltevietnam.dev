import { Events } from 'discord.js';

import { CHANNEL_ID_MAP } from './discord.constants.js';

/**
 * @typedef {import('discord.js').ClientEvents} ClientEvents
 * @typedef {import('discord.js').Client} Client
 */

/**
 * @template {keyof ClientEvents} K
 * @typedef {(...args: ClientEvents[K]) => import('discord.js').Awaitable<void>} ClientEventHandler
 */

/**
 * Listen for events from Svelte Vietnam discord guild
 * and send messages as a bot
 */
export class DiscordBot {
  /** @param {Client} client */
  #client;

  /** @type {ClientEventHandler<Events.GuildMemberAdd>} */
  #onGuildMemberAdd;

  /** @param {Client} client */
  constructor(client) {
    this.#client = client;
    this.#onGuildMemberAdd = (member) => {
      const helloChannel = this.#client.channels.cache.get(CHANNEL_ID_MAP.HELLO);
      if (!helloChannel || !helloChannel.isTextBased()) return;
      helloChannel.send(
        `Chào mừng thành viên mới <@${member.user.id}>. Welcome new member <@${member.user.id}> to Svelte Vietnam.`,
      );
    };
    this.#mountEvents();
  }

  #mountEvents() {
    this.#client.on(Events.GuildMemberAdd, this.#onGuildMemberAdd.bind(this));
  }
}
