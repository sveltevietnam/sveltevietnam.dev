import { createCheckin, getCheckin, type EventCheckin } from '@internals/db/daos/event_checkins';
import jwt from '@tsndr/cloudflare-worker-jwt';

import { JWT_SECRET } from '$env/static/private';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { EVENTS, findEventById, getEventStatus } from '$lib/data/events';
import { throwSvelteKitError } from '$lib/errors';
import { prepareRoutePageData } from '$lib/routing/routing.server';

import type { Actions, PageServerLoad } from './$types';
import { translations as pageT } from './_page/translation';

export const prerender = false;

const metaTranslations: Record<App.Language, App.PageData['meta']> = {
	vi: {
		title: 'Check-in | Sự kiện | Svelte Việt Nam',
	},
	en: {
		title: 'Check-in | Events | Svelte Vietnam',
	},
};

export const load: PageServerLoad = async ({ locals, depends, platform, url }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	const d1 = platform?.env?.D1;
	if (!d1) throwSvelteKitError('D1_NOT_AVAILABLE');

	const lang = locals.settings.language;
	let eventId: string | undefined = undefined;
	let email: string | undefined = undefined;

	// Check for ?qr
	const qr = decodeURIComponent(url.searchParams.get('qr') ?? '');
	if (qr) {
		try {
			// TODO: rotate secret after 2024.04.20 (meetup event)
			await jwt.verify(qr, JWT_SECRET, { throwError: true });
		} catch (e) {
			const message = (e as Error)?.message;
			if (['NOT_YET_VALID', 'EXPIRED'].every((cause) => !message.includes(cause))) {
				throwSvelteKitError('EVENT_SELF_CHECKIN_QR_INVALID', 'QR token is not valid');
			}
		}

		const { payload } = await jwt.decode<{ event: string }>(qr);

		eventId = payload?.event;
		email = payload?.sub;
		if (!email || !eventId)
			throwSvelteKitError('EVENT_SELF_CHECKIN_QR_MISSING_INFO', 'Email or event is missing');
	} else {
		// Check for ?event
		eventId = decodeURIComponent(url.searchParams.get('event') ?? '');
		if (!eventId) throwSvelteKitError('EVENT_SELF_CHECKIN_FORM_MISSING_INFO', 'Event is missing');
	}

	const event = findEventById(locals.settings.language, EVENTS, eventId);
	if (!event) throwSvelteKitError('EVENT_SELF_CHECKIN_EVENT_NOT_FOUND', 'Event not found');

	const checkinStatus = getEventStatus(event, 7_200_200);

	let checked: string | undefined;
	if (email) {
		const checkin = await getCheckin(d1, email, eventId);
		if (checkin) {
			checked = pageT[lang].checkin.success.already;
		} else if (checkinStatus === 'ongoing') {
			await createCheckin(d1, {
				event: eventId,
				email,
				method: 'token',
				created_at: new Date().toISOString(),
				created_by: 'self',
			});
			checked = pageT[lang].checkin.success.ok;
		}
	}

	return {
		route: prepareRoutePageData(lang, 'events_checkin'),
		event,
		status: {
			checkin: checkinStatus,
			event: getEventStatus(event),
		},
		form: {
			event: eventId,
			email,
			checked,
		},
		translations: {
			page: pageT[lang],
		},
		meta: metaTranslations[lang],
	};
};

export const actions: Actions = {
	default: async ({ request, locals, platform }) => {
		const d1 = platform?.env?.D1;
		if (!d1) throwSvelteKitError('D1_NOT_AVAILABLE');

		const t = pageT[locals.settings.language];
		const data = await request.formData();

		const event = data.get('event')?.toString();
		let email = data.get('email')?.toString();
		const qr = data.get('qr')?.toString();
		let method: EventCheckin['method'] = 'form';

		if (qr) {
			// TODO: rotate secret after 2024.04.20 (meetup event)
			const valid = await jwt.verify(qr, JWT_SECRET);
			if (!valid) {
				return { success: false, message: t.checkin.error.invalidQR };
			}
			const { payload } = await jwt.decode(qr);
			email = payload?.sub;
			method = 'qr';
		}

		if (!email || !event) {
			return { success: false, message: t.checkin.error.missing };
		}

		const checkin = await getCheckin(d1, email, event);
		if (checkin) {
			return { success: true, message: t.checkin.success.already };
		}

		await createCheckin(d1, {
			event,
			email,
			method,
			created_at: new Date().toISOString(),
			created_by: 'anonymous',
		});
		return { success: true, message: t.checkin.success.ok };
	},
};
