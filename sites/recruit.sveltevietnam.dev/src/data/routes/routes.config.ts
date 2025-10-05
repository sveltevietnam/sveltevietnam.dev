import type { Language } from '@sveltevietnam/i18n';
import { defineConfig } from '@sveltevietnam/routes/vite';

import type { AllRoutePath } from './generated/types';

export default defineConfig<AllRoutePath, Language>({
	outdir: 'src/data/routes/generated',
	debug: true,
	exclude: ['/'],
	localization: {
		param: 'lang',
		defs: {
			'/:lang/authenticate': {
				vi: '/:lang/xac-thuc',
			},
			'/:lang/logout': {
				vi: '/:lang/dang-xuat',
			},
			'/:lang/onboarding': {
				vi: '/:lang/hoan-thien-ho-so',
			},
			'/:lang/welcome': {
				vi: '/:lang/chao-mung',
			},
			'/:lang/profile': {
				vi: '/:lang/ho-so',
			},
			'/:lang/email-change-verification/:token': {
				vi: '/:lang/xac-thuc-thay-doi-email/:token',
			},
			'/:lang/postings': {
				vi: '/:lang/bai-dang-tuyen',
			},
			'/:lang/postings/:id': {
				vi: '/:lang/bai-dang-tuyen/:id',
			},
			'/:lang/postings/:id/edit': {
				vi: '/:lang/bai-dang-tuyen/:id/edit',
			},
			'/:lang/postings/create': {
				vi: '/:lang/bai-dang-tuyen/tao-moi',
			},
		},
	},
	names: {
		breadcrumbs: {
			root: '/:lang',
			exclude: [],
		},
		defs: {
			'/:lang': {
				vi: 'Trang chủ',
				default: 'Home',
			},
			'/:lang/authenticate': {
				vi: 'Đăng nhập',
				default: 'Authenticate',
			},
			'/:lang/logout': {
				vi: 'Đăng xuất',
				default: 'Logout',
			},
			'/:lang/onboarding': {
				vi: 'Hoàn thiện hồ sơ',
				default: 'Onboarding',
			},
			'/:lang/welcome': {
				vi: 'Chào mừng',
				default: 'Welcome',
			},
			'/:lang/profile': {
				vi: 'Hồ sơ',
				default: 'Profile',
			},
			'/:lang/postings': {
				vi: 'Đăng tuyển',
				default: 'Job Posting',
			},
			'/:lang/postings/:id/edit': {
				vi: 'Chỉnh sửa',
				default: 'Edit',
			},
			'/:lang/postings/create': {
				vi: 'Tạo mới',
				default: 'Create',
			},
		},
	},
});
