import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	const lang = locals.settings.language;
	return {
		route: {
			current: {
				key: 'design_blog_code',
				path: `/${lang}/design/blog/code`,
				label: 'Source Code',
			},
			alternate: {
				vi: {
					path: '/vi/thiet-ke/blog/code',
					label: 'Mã nguồn',
				},
				en: {
					path: '/en/design/blog/code',
					label: 'Source Code',
				},
			},
		},
	};
};
