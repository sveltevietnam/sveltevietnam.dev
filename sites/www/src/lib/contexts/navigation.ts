import { localizeLangVar, delocalizeLangVar } from '@internals/utils/language';
import { getContext, setContext } from 'svelte';
import { derived, writable, type Readable } from 'svelte/store';

const NAVIGATION_CONTEXT_ID = 'navigation';

export const ROUTE_MAP = {
	home: {
		vi: {
			path: '/vi',
			label: 'Trang chủ',
		},
		en: {
			path: '/en',
			label: 'Home',
		},
	},
	events: {
		vi: {
			path: '/vi/su-kien',
			label: 'Sự kiện',
		},
		en: {
			path: '/en/events',
			label: 'Events',
		},
	},
	blog: {
		vi: {
			path: '/vi/blog',
			label: 'Blog',
		},
		en: {
			path: '/en/blog',
			label: 'Blog',
		},
	},
	jobs: {
		vi: {
			path: '/vi/viec-lam',
			label: 'Việc làm',
		},
		en: {
			path: '/en/jobs',
			label: 'Jobs',
		},
	},
	impact: {
		vi: {
			path: '/vi/tac-dong',
			label: 'Tác động',
		},
		en: {
			path: '/en/impact',
			label: 'Impact',
		},
	},
	people: {
		vi: {
			path: '/vi/con-nguoi',
			label: 'Con người',
		},
		en: {
			path: '/en/people',
			label: 'People',
		},
	},
	sponsor: {
		vi: {
			path: '/vi/tai-tro',
			label: 'Tài trợ',
		},
		en: {
			path: '/en/sponsor',
			label: 'Sponsor',
		},
	},
	codeOfConduct: {
		vi: {
			path: '/vi/quy-tac-ung-xu',
			label: 'Quy tắc ứng xử',
		},
		en: {
			path: '/en/code-of-conduct',
			label: 'Code of Conduct',
		},
	},
	roadmap: {
		vi: {
			path: '/vi/lo-trinh',
			label: 'Lộ trình',
		},
		en: {
			path: '/en/roadmap',
			label: 'Roadmap',
		},
	},
	design: {
		vi: {
			path: '/vi/thiet-ke',
			label: 'Thiết kế',
		},
		en: {
			path: '/en/design',
			label: 'Design',
		},
	},
	design_typography: {
		vi: {
			path: '/vi/thiet-ke/chu-viet',
			label: 'Chữ viết',
		},
		en: {
			path: '/en/design/typography',
			label: 'Typography',
		},
	},
	design_colors: {
		vi: {
			path: '/vi/thiet-ke/mau-sac',
			label: 'Màu sắc',
		},
		en: {
			path: '/en/design/colors',
			label: 'Colors',
		},
	},
	design_blog: {
		vi: {
			path: '/vi/thiet-ke/blog',
			label: 'Blog',
		},
		en: {
			path: '/en/design/blog',
			label: 'Blog',
		},
	},
} as const satisfies Record<string, Record<App.Language, Omit<App.Route, 'key'>>>;

const UNIVERSAL_ROUTE_MAP = {
	sitemap: {
		path: '/sitemap.xml',
		label: 'Sitemap',
	},
	rss: {
		path: '/rss.xml',
		label: 'RSS',
	},
} as const satisfies Record<string, Omit<App.Route, 'key'>>;

export function prepareRoutePageData(
	lang: App.Language,
	key: keyof typeof ROUTE_MAP,
): App.PageData['route'] {
	const routes = ROUTE_MAP[key] as Record<App.Language, Omit<App.Route, 'key'>>;
	return {
		current: {
			key,
			...localizeLangVar(lang, routes),
		},
		alternate: delocalizeLangVar(routes),
	};
}

export function setNavigationContext(
	lang: Readable<App.Language>,
	initialRoute: App.PageData['route'],
) {
	const route = writable(initialRoute);
	return setContext(NAVIGATION_CONTEXT_ID, {
		current: route,
		is: derived(route, ($route) => (url: URL | string) => {
			const pathname = typeof url === 'string' ? url : url.pathname;
			if (pathname === ROUTE_MAP.home.en.path || pathname === ROUTE_MAP.home.vi.path) {
				return pathname === $route.current.path;
			}
			return $route.current.path.startsWith(pathname);
		}),
		routes: derived(lang, ($lang) => ({
			...UNIVERSAL_ROUTE_MAP,
			...Object.entries(ROUTE_MAP).reduce(
				(acc, [key, routes]) => {
					acc[key as keyof typeof ROUTE_MAP] = localizeLangVar(
						$lang,
						routes as Record<App.Language, Omit<App.Route, 'key'>>,
					);
					return acc;
				},
				{} as Record<keyof typeof ROUTE_MAP, Omit<App.Route, 'key'>>,
			),
		})),
	});
}

export function getNavigationContext() {
	return getContext<ReturnType<typeof setNavigationContext>>(NAVIGATION_CONTEXT_ID);
}
