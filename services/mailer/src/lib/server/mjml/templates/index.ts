import type { EMAIL_TEMPLATES as ET } from '@internals/isc/mailer';

import spring2024HCMMeetupRegistrationEn from './spring-2024-hcm-meetup-registration-en.template?raw';
import spring2024HCMMeetupRegistrationVi from './spring-2024-hcm-meetup-registration-vi.template?raw';
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
	SPRING_2024_HCM_MEETUP_REGISTRATION: {
		vi: {
			subject: 'Đăng ký thành công "Gặp mặt Xuân Giáp Thìn 2024 - Hồ Chí Minh"',
			html: spring2024HCMMeetupRegistrationVi,
			from: {
				email: NO_REPLY_EMAIL,
				name: 'Svelte Việt Nam',
			},
		},
		en: {
			subject: 'You\'re registered for "Svelte Vietnam Spring 2024 Ho Chi Minh Meetup"',
			html: spring2024HCMMeetupRegistrationEn,
			from: {
				email: NO_REPLY_EMAIL,
				name: 'Svelte Vietnam',
			},
		},
	},
};
