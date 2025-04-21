export type DynamicMapping = {
	localized: string[];
	paramPositions: number[];
	kit: string[];
};

export type RerouteFactory = (
	/**
	 * an optional function that resolves to the language at runtime,
	 * when defined can help optimize the reroute process
	 **/
	getLang?: (event: { url: URL; fetch: typeof fetch }) => string,
) => (event: { url: URL; fetch: typeof fetch }) => string;
