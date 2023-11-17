import { superValidate } from 'sveltekit-superforms/client';

import { mailSchema } from '$client/components/MailRegistrationForm';
import { translations as mailT } from '$server/actions/mail/translation';
import { LOAD_DEPENDENCIES } from '$shared/constants';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { LayoutServerLoad } from './$types';

const layoutTranslations = {
	vi: {
		title: 'Bản tin Blog Svelte Việt Nam',
		description: 'Đăng ký nhận thông báo để không bỏ lỡ bài viết mới từ Svelte Việt Nam',
	},
	en: {
		title: 'The Svelte Vietnam Blog Newsletter',
		description: 'Subscribe to receive notification for new blog post from Svelte Vietnam',
	},
};

export const load: LayoutServerLoad = async ({ url, depends, locals: { language } }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const mailForm = await superValidate(mailSchema);
	return {
		breadcrumbs: buildBreadcrumbs(url.pathname),
		translations: {
			layout: layoutTranslations[language],
			mail: mailT[language],
		},
		mailForm,
	};
};
