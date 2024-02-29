import {
	createSubscriptionRequest,
	createSendRequest,
	MAILER_ERRORS,
	type CreateSubscriptionResponseDTO,
} from '@internals/isc/mailer';
import { createQrUrl } from '@internals/isc/qr';
import { error, fail } from '@sveltejs/kit';
import type { NumericRange } from '@sveltejs/kit';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { message, setError, superValidate } from 'sveltekit-superforms/server';

import {
	JWT_SECRET,
	MAILER_CLIENT_ID,
	MAILER_CLIENT_SECRET,
	MAILER_SERVICE_URL,
	QR_JWT_SECRET,
	QR_SERVICE_URL,
} from '$env/static/private';
import { mailSchema } from '$lib/components/MailRegistrationForm';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { createTicket, getTicket, type EventTicket } from '$lib/daos/event_tickets.dao';
import { preparePageData, type EventQRCodeData } from '$lib/data/events';
import { throwSvelteKitError } from '$lib/errors';
import type { FormMessage } from '$lib/forms';
import { createMailTranslationAndSchema } from '$lib/forms/actions/mail/mail.server';
import { ROUTE_MAP } from '$lib/routing/routing.map';
import { buildBreadcrumbs, type Breadcrumb } from '$lib/routing/routing.server';
import { validateToken } from '$lib/turnstile/turnstile.server';

import type { PageServerLoad } from './$types';
import { event, structure } from './_page/data';
import { EVENT_ID } from './_page/data';
import { translations as pageT } from './_page/translation';

export const load: PageServerLoad = async ({ url, depends, locals, platform }) => {
	const email = url.searchParams.get('email');
	let ticket: EventTicket | null = null;
	if (email) {
		// get cloudflare bindings for d1 database
		const d1 = platform?.env?.D1;
		if (d1) {
			ticket = await getTicket(d1, email, EVENT_ID);
		}
	}
	const lang = locals.settings.language;
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const prepared = preparePageData(url, lang, event, structure);
	const ticketForm = await superValidate(mailSchema);
	return {
		...prepared,
		breadcrumbs: [
			...buildBreadcrumbs(url.pathname),
			{ label: prepared.event.title },
		] satisfies Breadcrumb[],
		translations: {
			page: pageT[lang],
		},
		ticketForm,
		ticket,
	};
};

const CALENDAR_LINK_TRANSLATION = {
	en: {
		addToCalendarText: 'Add event to your calendar',
		googleCalendarLink:
			'https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20240420T020000Z%2F20240420T040000Z&details=Clear%20your%20schedule%20for%20the%20first%20offline%20meetup%20from%20the%20Svelte%20Vietnam%20community%21%0A%0AJoin%20us%20to%20learn%20more%20about%20the%20Svelte%20experience%20and%20what%20people%20are%20building%20with%20it.%0A%0AStart%20chatting%20with%20fellow%20attendees%20today%3A%20discord.sveltevietnam.dev&location=Designveloper%2C%2055%20P.%20%C4%90%E1%BB%A9c%20Ch%C3%ADnh%2C%20Ph%C6%B0%E1%BB%9Dng%20Nguy%E1%BB%85n%20Th%C3%A1i%20B%C3%ACnh%2C%20Qu%E1%BA%ADn%201%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh%20700000%2C%20Vietnam&text=Svelte%20Vietnam%202024%20Spring%20Ho%20Chi%20Minh%20Meetup',
		microsoftOutlookLink:
			'https://outlook.live.com/calendar/0/action/compose?allday=false&body=Clear%20your%20schedule%20for%20the%20first%20offline%20meetup%20from%20the%20Svelte%20Vietnam%20community%21%0A%0AJoin%20us%20to%20learn%20more%20about%20the%20Svelte%20experience%20and%20what%20people%20are%20building%20with%20it.%0A%0AStart%20chatting%20with%20fellow%20attendees%20today%3A%20discord.sveltevietnam.dev&enddt=2024-04-20T04%3A00%3A00%2B00%3A00&location=Designveloper%2C%2055%20P.%20%C4%90%E1%BB%A9c%20Ch%C3%ADnh%2C%20Ph%C6%B0%E1%BB%9Dng%20Nguy%E1%BB%85n%20Th%C3%A1i%20B%C3%ACnh%2C%20Qu%E1%BA%ADn%201%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh%20700000%2C%20Vietnam&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=2024-04-20T02%3A00%3A00%2B00%3A00&subject=Svelte%20Vietnam%202024%20Spring%20Ho%20Chi%20Minh%20Meetup',
		microsoftOfficeLink:
			'https://outlook.office.com/calendar/action/compose?allday=false&body=Clear%20your%20schedule%20for%20the%20first%20offline%20meetup%20from%20the%20Svelte%20Vietnam%20community%21%0A%0AJoin%20us%20to%20learn%20more%20about%20the%20Svelte%20experience%20and%20what%20people%20are%20building%20with%20it.%0A%0AStart%20chatting%20with%20fellow%20attendees%20today%3A%20discord.sveltevietnam.dev&enddt=2024-04-20T04%3A00%3A00%2B00%3A00&location=Designveloper%2C%2055%20P.%20%C4%90%E1%BB%A9c%20Ch%C3%ADnh%2C%20Ph%C6%B0%E1%BB%9Dng%20Nguy%E1%BB%85n%20Th%C3%A1i%20B%C3%ACnh%2C%20Qu%E1%BA%ADn%201%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh%20700000%2C%20Vietnam&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=2024-04-20T02%3A00%3A00%2B00%3A00&subject=Svelte%20Vietnam%202024%20Spring%20Ho%20Chi%20Minh%20Meetup',
		yahooCalendarLink:
			'https://calendar.yahoo.com/?desc=Clear%20your%20schedule%20for%20the%20first%20offline%20meetup%20from%20the%20Svelte%20Vietnam%20community%21%0A%0AJoin%20us%20to%20learn%20more%20about%20the%20Svelte%20experience%20and%20what%20people%20are%20building%20with%20it.%0A%0AStart%20chatting%20with%20fellow%20attendees%20today%3A%20discord.sveltevietnam.dev&dur=&et=20240420T040000Z&in_loc=Designveloper%2C%2055%20P.%20%C4%90%E1%BB%A9c%20Ch%C3%ADnh%2C%20Ph%C6%B0%E1%BB%9Dng%20Nguy%E1%BB%85n%20Th%C3%A1i%20B%C3%ACnh%2C%20Qu%E1%BA%ADn%201%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh%20700000%2C%20Vietnam&st=20240420T020000Z&title=Svelte%20Vietnam%202024%20Spring%20Ho%20Chi%20Minh%20Meetup&v=60',
	},
	vi: {
		addToCalendarText: 'Thêm sự kiện vào lịch của bạn',
		googleCalendarLink:
			'https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20240420T020000Z%2F20240420T040000Z&details=%C4%90%E1%BA%BFn%20h%E1%BA%B9n%20l%E1%BA%A1i%20l%C3%AAn%21%0A%0AH%E1%BA%B9n%20g%E1%BA%A1p%20b%E1%BA%A1n%20t%E1%BA%A1i%20s%E1%BB%B1%20ki%E1%BB%87n%20g%E1%BA%B7p%20m%E1%BA%B7t%20tr%E1%BB%B1c%20ti%E1%BA%BFp%20%C4%91%E1%BA%A7u%20ti%C3%AAn%20c%E1%BB%A7a%20c%E1%BB%99ng%20%C4%91%E1%BB%93ng%20Svelte%20Vi%E1%BB%87t%20Nam%20%C4%91%E1%BB%83%20chia%20s%E1%BA%BB%20v%C3%A0%20t%C3%ACm%20hi%E1%BB%83u%20th%C3%AAm%20v%E1%BB%81%20Svelte%20nh%C3%A9%21%0A%0ATham%20gia%20th%E1%BA%A3o%20lu%E1%BA%ADn%20v%E1%BB%81%20s%E1%BB%B1%20ki%E1%BB%87n%20ngay%20b%C3%A2y%20gi%E1%BB%9D%20t%E1%BA%A1i%3A%20discord.sveltevietnam.dev&location=Designveloper%2C%2055%20P.%20%C4%90%E1%BB%A9c%20Ch%C3%ADnh%2C%20Ph%C6%B0%E1%BB%9Dng%20Nguy%E1%BB%85n%20Th%C3%A1i%20B%C3%ACnh%2C%20Qu%E1%BA%ADn%201%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh%20700000%2C%20Vietnam&text=Svelte%20Vi%E1%BB%87t%20Nam%3A%20G%E1%BA%B7p%20m%E1%BA%B7t%20Xu%C3%A2n%20Gi%C3%A1p%20Th%C3%ACn%202024%20-%20H%E1%BB%93%20Ch%C3%AD%20Minh',
		microsoftOutlookLink:
			'https://outlook.live.com/calendar/0/action/compose?allday=false&body=%C4%90%E1%BA%BFn%20h%E1%BA%B9n%20l%E1%BA%A1i%20l%C3%AAn%21%0A%0AH%E1%BA%B9n%20g%E1%BA%A1p%20b%E1%BA%A1n%20t%E1%BA%A1i%20s%E1%BB%B1%20ki%E1%BB%87n%20g%E1%BA%B7p%20m%E1%BA%B7t%20tr%E1%BB%B1c%20ti%E1%BA%BFp%20%C4%91%E1%BA%A7u%20ti%C3%AAn%20c%E1%BB%A7a%20c%E1%BB%99ng%20%C4%91%E1%BB%93ng%20Svelte%20Vi%E1%BB%87t%20Nam%20%C4%91%E1%BB%83%20chia%20s%E1%BA%BB%20v%C3%A0%20t%C3%ACm%20hi%E1%BB%83u%20th%C3%AAm%20v%E1%BB%81%20Svelte%20nh%C3%A9%21%0A%0ATham%20gia%20th%E1%BA%A3o%20lu%E1%BA%ADn%20v%E1%BB%81%20s%E1%BB%B1%20ki%E1%BB%87n%20ngay%20b%C3%A2y%20gi%E1%BB%9D%20t%E1%BA%A1i%3A%20discord.sveltevietnam.dev&enddt=2024-04-20T04%3A00%3A00%2B00%3A00&location=Designveloper%2C%2055%20P.%20%C4%90%E1%BB%A9c%20Ch%C3%ADnh%2C%20Ph%C6%B0%E1%BB%9Dng%20Nguy%E1%BB%85n%20Th%C3%A1i%20B%C3%ACnh%2C%20Qu%E1%BA%ADn%201%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh%20700000%2C%20Vietnam&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=2024-04-20T02%3A00%3A00%2B00%3A00&subject=Svelte%20Vi%E1%BB%87t%20Nam%3A%20G%E1%BA%B7p%20m%E1%BA%B7t%20Xu%C3%A2n%20Gi%C3%A1p%20Th%C3%ACn%202024%20-%20H%E1%BB%93%20Ch%C3%AD%20Minh',
		microsoftOfficeLink:
			'https://outlook.office.com/calendar/action/compose?allday=false&body=%C4%90%E1%BA%BFn%20h%E1%BA%B9n%20l%E1%BA%A1i%20l%C3%AAn%21%0A%0AH%E1%BA%B9n%20g%E1%BA%A1p%20b%E1%BA%A1n%20t%E1%BA%A1i%20s%E1%BB%B1%20ki%E1%BB%87n%20g%E1%BA%B7p%20m%E1%BA%B7t%20tr%E1%BB%B1c%20ti%E1%BA%BFp%20%C4%91%E1%BA%A7u%20ti%C3%AAn%20c%E1%BB%A7a%20c%E1%BB%99ng%20%C4%91%E1%BB%93ng%20Svelte%20Vi%E1%BB%87t%20Nam%20%C4%91%E1%BB%83%20chia%20s%E1%BA%BB%20v%C3%A0%20t%C3%ACm%20hi%E1%BB%83u%20th%C3%AAm%20v%E1%BB%81%20Svelte%20nh%C3%A9%21%0A%0ATham%20gia%20th%E1%BA%A3o%20lu%E1%BA%ADn%20v%E1%BB%81%20s%E1%BB%B1%20ki%E1%BB%87n%20ngay%20b%C3%A2y%20gi%E1%BB%9D%20t%E1%BA%A1i%3A%20discord.sveltevietnam.dev&enddt=2024-04-20T04%3A00%3A00%2B00%3A00&location=Designveloper%2C%2055%20P.%20%C4%90%E1%BB%A9c%20Ch%C3%ADnh%2C%20Ph%C6%B0%E1%BB%9Dng%20Nguy%E1%BB%85n%20Th%C3%A1i%20B%C3%ACnh%2C%20Qu%E1%BA%ADn%201%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh%20700000%2C%20Vietnam&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=2024-04-20T02%3A00%3A00%2B00%3A00&subject=Svelte%20Vi%E1%BB%87t%20Nam%3A%20G%E1%BA%B7p%20m%E1%BA%B7t%20Xu%C3%A2n%20Gi%C3%A1p%20Th%C3%ACn%202024%20-%20H%E1%BB%93%20Ch%C3%AD%20Minh',
		yahooCalendarLink:
			'https://calendar.yahoo.com/?desc=%C4%90%E1%BA%BFn%20h%E1%BA%B9n%20l%E1%BA%A1i%20l%C3%AAn%21%0A%0AH%E1%BA%B9n%20g%E1%BA%A1p%20b%E1%BA%A1n%20t%E1%BA%A1i%20s%E1%BB%B1%20ki%E1%BB%87n%20g%E1%BA%B7p%20m%E1%BA%B7t%20tr%E1%BB%B1c%20ti%E1%BA%BFp%20%C4%91%E1%BA%A7u%20ti%C3%AAn%20c%E1%BB%A7a%20c%E1%BB%99ng%20%C4%91%E1%BB%93ng%20Svelte%20Vi%E1%BB%87t%20Nam%20%C4%91%E1%BB%83%20chia%20s%E1%BA%BB%20v%C3%A0%20t%C3%ACm%20hi%E1%BB%83u%20th%C3%AAm%20v%E1%BB%81%20Svelte%20nh%C3%A9%21%0A%0ATham%20gia%20th%E1%BA%A3o%20lu%E1%BA%ADn%20v%E1%BB%81%20s%E1%BB%B1%20ki%E1%BB%87n%20ngay%20b%C3%A2y%20gi%E1%BB%9D%20t%E1%BA%A1i%3A%20discord.sveltevietnam.dev&dur=&et=20240420T040000Z&in_loc=Designveloper%2C%2055%20P.%20%C4%90%E1%BB%A9c%20Ch%C3%ADnh%2C%20Ph%C6%B0%E1%BB%9Dng%20Nguy%E1%BB%85n%20Th%C3%A1i%20B%C3%ACnh%2C%20Qu%E1%BA%ADn%201%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh%20700000%2C%20Vietnam&st=20240420T020000Z&title=Svelte%20Vi%E1%BB%87t%20Nam%3A%20G%E1%BA%B7p%20m%E1%BA%B7t%20Xu%C3%A2n%20Gi%C3%A1p%20Th%C3%ACn%202024%20-%20H%E1%BB%93%20Ch%C3%AD%20Minh&v=60',
	},
};

export const actions = {
	ticket: async ({ request, locals, fetch, platform, url }) => {
		// get cloudflare bindings for d1 database
		const d1 = platform?.env?.D1;
		if (!d1) throwSvelteKitError('D1_NOT_AVAILABLE');

		// create i18n-aware validation schema
		const { t, s } = createMailTranslationAndSchema(locals.settings.language);

		// parse form object
		const form = await superValidate<typeof s, FormMessage>(request, s);
		if (!form.valid) {
			return fail(400, { form });
		}

		// check cloudflare turnstile captcha
		const turnstile = await validateToken(form.data.turnstile);
		if (!turnstile.success) {
			setError(form, 'turnstile', turnstile.error?.[0] ?? t.error.captcha.unknown);
			return fail(400, { form });
		}

		const { email, name } = form.data;

		const ticket = await getTicket(d1, email, EVENT_ID);
		if (ticket) {
			return message(form, {
				type: 'success',
				text: t.alreadyRegister,
			});
		}

		await createTicket(d1, {
			email,
			name,
			event: EVENT_ID,
			created_at: new Date().toISOString(),
		});

		const language = locals.settings.language;
		const personalizedEventURL = `${url.origin}${ROUTE_MAP.events[language].path}/${event.slug[language]}?email=${email}`;

		const qrData = await jwt.sign<EventQRCodeData>(
			{
				event: EVENT_ID,
				iss: 'sveltevietnam.dev',
				sub: email,
				iat: Math.floor(new Date().getTime() / 1000),
				nbf: Math.floor(new Date(event.startDate).getTime() / 1000) - 2 * 60 * 60,
				exp: Math.floor(new Date(event.endDate).getTime() / 1000) + 2 * 60 * 60,
			},
			JWT_SECRET,
		);
		const qrURL = await createQrUrl(QR_SERVICE_URL, QR_JWT_SECRET, { data: qrData });
		const selfCheckInURL = `${url.origin}${ROUTE_MAP.events_selfCheckIn[language].path}?qr=${qrData}`;

		await fetch(
			await createSendRequest(
				{
					templateId: 'SPRING_2024_HCM_MEETUP_REGISTRATION',
					to: { email, name },
					language,
					variables: {
						...CALENDAR_LINK_TRANSLATION[language],
						name,
						email,
						personalizedEventURL,
						qrURL,
						selfCheckInURL,
					},
				},
				{
					clientID: MAILER_CLIENT_ID,
					clientSecret: MAILER_CLIENT_SECRET,
					serviceURL: MAILER_SERVICE_URL,
				},
			),
		).then(async (resp) => {
			if (!resp.ok) {
				const json = await resp.json();
				console.error('/send error:', json);
			}
		});

		const response = await fetch(
			await createSubscriptionRequest(
				{
					email,
					name,
					domain: form.data.checkbox ? 'event' : undefined,
					language,
					skipMail: true,
				},
				{
					clientID: MAILER_CLIENT_ID,
					clientSecret: MAILER_CLIENT_SECRET,
					serviceURL: MAILER_SERVICE_URL,
				},
			),
		);
		const data = (await response.json()) as CreateSubscriptionResponseDTO;

		if (!data.success) {
			if (data.code === MAILER_ERRORS.SUBSCRIPTION_CREATE_ALREADY_EXISTS.code) {
				return message(form, {
					type: 'success',
					text: t.alreadyRegister,
				});
			}
			error(response.status as NumericRange<400, 599>, {
				code: data.code,
				message: '`${t.error.unknown} [CODE: ${data.code}]`',
			});
		}

		return message(form, {
			type: 'success',
			text: t.success,
		});
	},
};
