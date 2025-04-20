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
	/**
	 * regex pattern that if matched will skip processing
	 */
	exclude?: ExcludeOption<RoutePath>;
	/** generate conditional returns based on language in parameters */
	localization?: LocalizationOptions & {
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
		breadcrumbs?: boolean | BreadcrumbOptions<RoutePath>;
		defs: Partial<Record<RoutePath, NameDef<Language>>>;
	};
};

export type TransformOptions<RoutePath extends string> = {
	exclude?: ExcludeOption<RoutePath>;
	localization?: LocalizationOptions;
	breadcrumbs?: boolean | BreadcrumbOptions<RoutePath>;
};

export type ExcludeOption<RoutePath extends string> =
	| RoutePath[]
	| {
			paths?: RoutePath[];
			patterns?: string | string[];
	  };

export type LocalizationOptions = {
	/**
	 * the parameter on how to resolve the language at runtime
	 * this can be a route param or an explicit param
	 */
	param?: string;
};

export type BreadcrumbOptions<RoutePath extends string> = {
	/**
	 * the root route to start breadcrumbs from,
	 * typically '/'
	 **/
	root?: RoutePath | RoutePath[];
	/**
	 * route to skip in breadcrumbs
	 * can the form of a string or an object of { <path>: <strategy> }, where strategy is:
	 * - 'self': skip building breadcrumb for this route
	 * - 'others': skip occurrences of this route in other breadcrumbs
	 * - 'all': applies both 'self' and 'others' (default)
	 */
	exclude?: Array<RoutePath> | Partial<Record<RoutePath, 'self' | 'others' | 'all'>>;
	// TODO:change this to an array of pattern string and move on!
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
		excludedRoutes: Route[];
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
