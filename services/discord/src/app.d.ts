declare module 'fastify' {
  interface FastifyInstance {
    config: {
      DISCORD_TOKEN: string;
      DISCORD_APPLICATION_ID: string;
      DISCORD_PUBLIC_KEY: string;
      DISCORD_SVELTEVIETNAM_GUILD_ID: string;
    };
  }
}
