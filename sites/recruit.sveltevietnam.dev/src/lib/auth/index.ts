import {
	employers,
	employerSessions,
	employerAuthVerifications,
} from '@sveltevietnam/backend/db/schema';
import type { Language } from '@sveltevietnam/i18n';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { magicLink } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { drizzle } from 'drizzle-orm/d1';

import { getRequestEvent } from '$app/server';
import * as p from '$data/routes/generated';
import { VITE_PRIVATE_BETTER_AUTH_SECRET } from '$env/static/private';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';
import { getBackend } from '$lib/backend/utils';

export function createEmployerAuth() {
	const event = getRequestEvent();
	const d1 = event.platform?.env?.d1;
	if (!d1) {
		throw new Error('D1 database is not available');
	}
	const orm = drizzle(d1, {
		schema: {
			user: employers,
			session: employerSessions,
			verification: employerAuthVerifications,
		},
	});
	const emailExpiresIn = event.platform?.env?.AUTHENTICATE_EMAIL_EXPIRATION_SECONDS ?? 180;
	return betterAuth({
		appName: 'Svelte Vietnam Recruit',
		baseURL: VITE_PUBLIC_ORIGIN,
		secret: VITE_PRIVATE_BETTER_AUTH_SECRET,
		database: drizzleAdapter(orm, { provider: 'sqlite' }),
		user: {
			additionalFields: {
				website: {
					type: 'string',
					required: false,
				},
				description: {
					type: 'string',
					required: true,
					defaultValue: '',
				},
				agreed: {
					type: 'boolean',
					required: true,
					defaultValue: false,
				},
				onboardedAt: {
					type: 'date',
					required: false,
				},
			},
			changeEmail: {
				enabled: true,
				sendChangeEmailVerification: async ({ user, newEmail, token }, request) => {
					const headers = Object.fromEntries(request!.headers.entries());
					const lang = headers['x-auth-lang'] as Language;
					await getBackend()
						.mails()
						.queue('recruit-employer-change-email' as const, {
							actorId: user.id,
							lang,
							vars: {
								name: user.name,
								newEmail,
								callbackUrl:
									VITE_PUBLIC_ORIGIN +
									p['/:lang/email-change-verification/:token']({ lang, token }),
							},
						});
				},
			},
		},
		session: {
			fields: {
				userId: 'employerId',
				ipAddress: 'ip',
			},
		},
		emailVerification: {
			expiresIn: emailExpiresIn,
		},
		plugins: [
			magicLink({
				expiresIn: emailExpiresIn,
				sendMagicLink: async ({ url, email }, request) => {
					const headers = Object.fromEntries(request!.headers.entries());
					const lang = headers['x-auth-lang'] as Language;
					const type = headers['x-auth-type'] === 'signup' ? 'signup' : 'login';

					const backend = getBackend();
					const mails = backend.mails();
					const employers = backend.employers();
					if (type === 'signup') {
						await mails.queue('recruit-employer-onboard' as const, {
							lang,
							email,
							vars: { callbackUrl: url },
						});
					} else {
						await mails.queue('recruit-employer-login' as const, {
							lang,
							actorId: (await employers.getIdByEmail(email))!,
							vars: { name: headers['x-auth-name']!, callbackUrl: url },
						});
					}
				},
			}),
			sveltekitCookies(getRequestEvent),
		],
		telemetry: { enabled: false },
		advanced: {
			database: {
				generateId: false,
			},
			ipAddress: {
				ipAddressHeaders: ['cf-connecting-ip', 'x-real-ip'],
				disabled: false,
			},
		},
	});
}

export type Auth = Awaited<ReturnType<typeof createEmployerAuth>>;
export type Session = Auth['$Infer']['Session']['session'];
export type User = Auth['$Infer']['Session']['user'];
