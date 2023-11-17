import { Events } from 'discord.js';
import debounce from 'lodash.debounce';
import { v4 as uuidv4 } from 'uuid';

import { SVELTEVIETNAM_GUILD_ID } from './discord.constants.js';

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

		this.#onMessageCreate = debounce(
			async (message) => {
				if (!message.author.bot) {
					const guild = this.#client.guilds.cache.get(SVELTEVIETNAM_GUILD_ID);
					const member = guild?.members.cache.get(message.author.id);
					if (member) {
						// const avatarURL = message.author.displayAvatarURL();
						for (const connection of Object.values(this.#connections)) {
							const payload = {
								type: 'message',
								data: {
									avatarURL: member.displayAvatarURL(),
									name: member.displayName,
								},
							};
							connection.socket.send(JSON.stringify(payload));
						}
					}
				}
			},
			5000,
			{ leading: true, trailing: false },
		);
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
