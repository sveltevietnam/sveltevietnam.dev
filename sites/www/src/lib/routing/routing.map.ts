export const UNIVERSAL_ROUTE_MAP = {
	sitemap: {
		path: '/sitemap.xml',
		label: 'Sitemap',
	},
	rss: {
		path: '/rss.xml',
		label: 'RSS',
	},
} as const satisfies Record<string, Omit<App.Route, 'key'>>;

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
	blueScreenOfDeath: {
		vi: {
			path: '/vi/man-hinh-xanh',
			label: 'Màn hình xanh',
		},
		en: {
			path: '/en/blue-screen-of-death',
			label: 'Blue Screen of Death',
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
	events_checkin: {
		vi: {
			path: '/vi/su-kien/check-in',
			label: 'Check-in',
		},
		en: {
			path: '/en/events/check-in',
			label: 'Check-in',
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
	settings: {
		vi: {
			path: '/vi/cai-dat',
			label: 'Cài đặt',
		},
		en: {
			path: '/en/settings',
			label: 'Settings',
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
	design_blog_code: {
		vi: {
			path: '/vi/thiet-ke/blog/code',
			label: 'Mã nguồn',
		},
		en: {
			path: '/en/design/blog/code',
			label: 'Source Code',
		},
	},
	subscriptions: {
		vi: {
			path: '/vi/dang-ky',
			label: 'Đăng ký',
		},
		en: {
			path: '/en/subscriptions',
			label: 'Subscriptions',
		},
	},
} as const satisfies Record<string, Record<App.Language, Omit<App.Route, 'key'>>>;
