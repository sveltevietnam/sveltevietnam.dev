import { superValidate } from 'sveltekit-superforms/client';

import { mailSchema } from '$lib/components/MailRegistrationForm';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { translations as mailT } from '$lib/forms/actions/mail/translation';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ depends, locals: { language } }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const mailForm = await superValidate(mailSchema);
	return {
		mail: {
			translation: mailT[language],
			form: mailForm,
		},
	};
};