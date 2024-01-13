import type { EMAIL_TEMPLATES as ET } from '@internals/isc/mailer';

import welcomeEn from './welcome-en.template?raw';
import welcomeVi from './welcome-vi.template?raw';

export type MailTemplate = {
	subject: string;
	html: string;
	from: {
		email: string;
		name: string;
	};
};

export const NO_REPLY_EMAIL = 'no-reply@sveltevietnam.dev';

export const EMAIL_TEMPLATES: Record<(typeof ET)[number], Record<App.Language, MailTemplate>> = {
	// if template key changes, remember to update the `mails` table (template_id column) in database
	WELCOME: {
		vi: {
			subject: 'Chào mừng bạn đến với Svelte Việt Nam!',
			html: welcomeVi,
			from: {
				email: NO_REPLY_EMAIL,
				name: 'Svelte Việt Nam',
			},
		},
		en: {
			subject: 'Welcome to Svelte Vietnam',
			html: welcomeEn,
			from: {
				email: NO_REPLY_EMAIL,
				name: 'Svelte Vietnam',
			},
		},
	},
};
