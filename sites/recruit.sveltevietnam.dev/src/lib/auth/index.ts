import * as tables from '@sveltevietnam/backend/data/employers/tables';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { magicLink } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { drizzle } from 'drizzle-orm/d1';

import { getRequestEvent } from '$app/server';
import { VITE_PRIVATE_BETTER_AUTH_SECRET } from '$env/static/private';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';

export function createEmployerAuth() {
	const event = getRequestEvent();
	const d1 = event.platform?.env?.d1;
	if (!d1) {
		throw new Error('D1 database is not available');
	}
	const orm = drizzle(d1, { schema: tables });
	return betterAuth({
		appName: 'Svelte Vietnam Recruit',
		baseURL: VITE_PUBLIC_ORIGIN,
		secret: VITE_PRIVATE_BETTER_AUTH_SECRET,
		database: drizzleAdapter(orm, {
			provider: 'sqlite',
			schema: {
				user: tables.employers,
				session: tables.employerSessions,
				verification: tables.employerVerifications,
			},
		}),
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
		},
		session: {
			fields: {
				userId: 'employerId',
				ipAddress: 'ip',
			},
		},
		plugins: [
			magicLink({
				sendMagicLink: async ({ url, email, token }) => {
					console.error('IP', event.getClientAddress());
					const lang = event.params.lang ?? 'en';
					const type = event.route.id === '/[lang=lang]/signup' ? 'signup' : 'login';

					// TODO: send email with lang; distinguish between signup and login
					// const mails = getBackend(event).mails();
					console.error(url, email, token, lang, type);
				},
			}),
			sveltekitCookies(getRequestEvent),
		],
		telemetry: { enabled: false },
		advanced: {
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
