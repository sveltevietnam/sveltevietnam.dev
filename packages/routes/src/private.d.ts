export type RoutesOptions = {
	/**
	 * path to the routes directory,
	 * i.e `kit.files.routes`
	 * @see {@link https://svelte.dev/docs/kit/configuration#files}
	 * @default `'src/routes'`
	 */
	routes: string;
	/**
	 * output directory for the generated route information
	 * @default `'src/lib/routes'`
	 */
	outdir: string;
	/**
	 * when true will write debug YAML to outdir
	 */
	debug: boolean;
};

export type Route = {
	path: string;
	segments: string[];
	params?: {
		position: number;
		name: string;
		required: boolean;
	}[];
};

export type RoutesVitePluginApi = {
	collectRoutes: <Logger extends import('vite').Logger = import('vite').Logger>(
		routesPath?: string,
		logger?: Logger,
	) => Promise<Route[]>;
};
