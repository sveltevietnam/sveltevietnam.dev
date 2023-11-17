import fastifyPlugin from 'fastify-plugin';

import { DiscordService } from './discord.service.js';

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
