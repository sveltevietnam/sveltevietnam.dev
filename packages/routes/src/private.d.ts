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
	/** generate conditional returns based on language in parameters */
	localization?: {
		/**
		 * the parameter on how to resolve the language at runtime
		 * this can be a route param or an explicit param
		 */
		param: string;
		/**
		 * mapping of localized routes
		 */
		defs: Partial<Record<RoutePath, LocalizationDef<Language>>>;
	};
	/**
	 * generate name getter for each route
	 **/
	names?: {
		/** whether to generate breadcrumbs */
		breadcrumbs?:
			| boolean
			| {
					/** the root route, i.e homepage */
					root: RoutePath;
			  };
		defs: Partial<Record<RoutePath, NameDef<Language>>>;
	};
};

export type LocalizationDef<Language extends string> = Partial<Record<Language, string>>;

export type NameDef<Language extends string> =
	| string
	| (Partial<Record<Language, string>> & { default: string });

export type Route = {
	path: string;
	segments:
		| string[]
		| {
				[lang: string]: string[];
				default: string[];
		  };
	params?: Param[];
	name?:
		| string
		| {
				[lang: string]: string;
				default: string;
		  };
};

export type RouteWithNameDef = Omit<Route, 'name'> & Required<Pick<Route, 'name'>>;

export type Param = {
	position: number;
	name: string;
	required: boolean;
};

export type TransformOutput = {
	report: {
		dynamicRoutes: Route[];
		staticRoutes: Route[];
	};
	modules: {
		routes: string;
		types?: string;
		names?: string;
		breadcrumbs?: string;
	};
};

export type RoutesVitePluginApi = {
	collectRoutes: <Logger extends import('vite').Logger = import('vite').Logger>(
		routesPath?: string,
		logger?: Logger,
	) => Promise<Route[]>;
};
