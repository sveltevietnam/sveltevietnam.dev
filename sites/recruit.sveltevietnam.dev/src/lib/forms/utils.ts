import type { Language } from '@sveltevietnam/kit/constants';
import type { Toaster } from '@sveltevietnam/kit/notifications';
import type { superForm } from 'sveltekit-superforms';

import * as m from '$lib/i18n/generated/messages';

type SuperFormErrorHandler = NonNullable<Parameters<typeof superForm>[1]>['onError'];

export function createSuperFormGenericErrorHandler(
	toaster: Toaster,
	lang: Language,
): SuperFormErrorHandler {
	return function ({ result }) {
		const error = result.error as App.Error;
		toaster.error({
			title: `${error.code} - ${error.message}`,
			message: m['errors.generic'](lang),
		});
	};
}
