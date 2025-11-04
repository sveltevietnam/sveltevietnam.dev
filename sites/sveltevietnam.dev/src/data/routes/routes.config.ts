import type { Language } from '@sveltevietnam/kit/constants';
import { defineConfig } from '@sveltevietnam/routes/vite';

import type { AllRoutePath } from './generated/types';

export default defineConfig<AllRoutePath, Language>({
	outdir: 'src/data/routes/generated',
	debug: !process.env.CI,
	exclude: ['/'],
	localization: {
		param: 'lang',
		defs: {
			'/:lang/blog/write': {
				vi: '/:lang/blog/viet',
			},
			'/:lang/blog/categories': {
				vi: '/:lang/blog/chu-de',
			},
			'/:lang/blog/latest': {
				vi: '/:lang/blog/moi-nhat',
			},
			'/:lang/blog/series': {
				vi: '/:lang/blog/chuoi-bai-viet',
			},
			'/:lang/code-of-conduct': {
				vi: '/:lang/quy-tac-ung-xu',
			},
			'/:lang/design': {
				vi: '/:lang/thiet-ke',
			},
			'/:lang/events': {
				vi: '/:lang/su-kien',
			},
			'/:lang/jobs': {
				vi: '/:lang/viec-lam',
			},
			'/:lang/jobs/:id': {
				vi: '/:lang/viec-lam/:id',
			},
			'/:lang/people': {
				vi: '/:lang/con-nguoi',
			},
			'/:lang/roadmap': {
				vi: '/:lang/lo-trinh',
			},
			'/:lang/settings': {
				vi: '/:lang/cai-dat',
			},
			'/:lang/sponsor': {
				vi: '/:lang/tai-tro',
			},
		},
	},
	names: {
		breadcrumbs: {
			root: '/:lang',
			exclude: ['/blue-screen-of-death', '/:lang/sitemap.xml', '/:lang/rss.xml'],
		},
		defs: {
			'/': 'IHOME',
			'/:lang/mails/:id': 'Mail',
			'/:lang/everify/:token': {
				vi: 'Xác thực email',
				default: 'Email Verification',
			},
			'/:lang': {
				vi: 'Trang chủ',
				default: 'Home',
			},
			'/:lang/blog': 'Blog',
			'/:lang/blog/write': {
				vi: 'Hướng dẫn viết bài',
				default: 'Writing Guide',
			},
			'/:lang/blog/categories': {
				vi: 'Chủ đề',
				default: 'Categories',
			},
			'/:lang/blog/series': {
				vi: 'Chuỗi bài viết',
				default: 'Series',
			},
			'/:lang/blog/latest': {
				vi: 'Mới nhất',
				default: 'Latest',
			},
			'/:lang/code-of-conduct': {
				vi: 'Quy tắc ứng xử',
				default: 'Code of Conduct',
			},
			'/:lang/design': {
				vi: 'Thiết kế',
				default: 'Design',
			},
			'/:lang/events': {
				vi: 'Sự kiện',
				default: 'Events',
			},
			'/:lang/jobs': {
				vi: 'Việc làm',
				default: 'Jobs',
			},
			'/:lang/people': {
				vi: 'Con người',
				default: 'People',
			},
			'/:lang/roadmap': {
				vi: 'Lộ trình',
				default: 'Roadmap',
			},
			'/:lang/settings': {
				vi: 'Cài đặt',
				default: 'Settings',
			},
			'/:lang/sponsor': {
				vi: 'Tài trợ',
				default: 'Sponsor',
			},
			'/:lang/sitemap.xml': {
				vi: 'Sơ đồ trang',
				default: 'Sitemap',
			},
			'/:lang/rss.xml': 'RSS',
		},
	},
});
