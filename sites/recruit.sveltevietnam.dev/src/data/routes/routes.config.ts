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
			'/:lang/login': {
				vi: '/:lang/dang-nhap',
			},
			'/:lang/signup': {
				vi: '/:lang/dang-ky',
			},
			'/:lang/onboarding': {
				vi: '/:lang/hoan-thien-ho-so',
			},
			'/:lang/postings/:id': {
				vi: '/:lang/bai-dang-tuyen/:id',
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
				vi: 'Hồ sơ',
				default: 'Profile',
			},
			'/:lang/login': {
				vi: 'Đăng nhập',
				default: 'Login',
			},
			'/:lang/signup': {
				vi: 'Đăng ký',
				default: 'Sign Up',
			},
			'/:lang/onboarding': {
				vi: 'Hoàn thiện hồ sơ',
				default: 'Onboarding',
			},
			'/:lang/postings/:id': {
				vi: 'Bài đăng tuyển',
				default: 'Job Posting',
			},
			'/:lang/postings/create': {
				vi: 'Tạo bài đăng tuyển',
				default: 'Create Job Posting',
			},
		},
	},
});
