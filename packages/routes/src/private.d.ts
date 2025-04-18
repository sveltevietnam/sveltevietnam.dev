export type RoutesOptions<RoutePath extends string, Language extends string = string> = {
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
	localization?: {
		/**
		 * the parameter on how to resolve the language at runtime
		 * this can be a route param or an explicit param
		 */
		param: string;
		/**
		 * mapping of localized routes
		 */
		defs?: Partial<Record<RoutePath, Partial<Record<Language, string>>>>;
	};
};

export type Route = {
	path: string;
	segments:
		| string[]
		| {
				[lang: string]: string[];
				default: string[];
		  };
	params?: Param[];
};

export type Param = {
	position: number;
	name: string;
	required: boolean;
};

export type RoutesVitePluginApi = {
	collectRoutes: <Logger extends import('vite').Logger = import('vite').Logger>(
		routesPath?: string,
		logger?: Logger,
	) => Promise<Route[]>;
};
