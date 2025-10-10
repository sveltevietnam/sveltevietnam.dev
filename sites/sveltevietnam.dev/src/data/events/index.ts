import type { Language } from '@sveltevietnam/i18n';
import { formatTime } from '@sveltevietnam/kit/utilities/datetime';
import type { Component } from 'svelte';
import type { Picture } from 'vite-imagetools';

import type * as t from './types';
export type * from './types';

export function defineEventMetadata(def: t.EventMetadataDefinition): t.EventMetadataDefinition {
	return def;
}

export function defineEventAdditionalStructuredData(
	def: t.EventAdditionalStructuredDataDefinition,
): t.EventAdditionalStructuredDataDefinition {
	return def;
}

const metadataModules = import.meta.glob<t.EventMetadataDefinition>('./*/metadata.ts', {
	import: 'default',
});
const additionalStructuredDataModules =
	import.meta.glob<t.EventAdditionalStructuredDataDefinition | null>(
		'./*/additionalStructuredData.ts',
		{
			import: 'structured',
		},
	);
const thumbnailModules = import.meta.glob<Picture>('./*/images/thumbnail.jpg', {
	import: 'default',
	query: '?enhanced&w=1200;700;400',
});
const ogImageModules = import.meta.glob<string>('./*/images/og.jpg', {
	import: 'default',
});
const contentModules = import.meta.glob<Component>('./*/content.svelte', {
	import: 'default',
});

export const ids = Object.keys(metadataModules)
	.map((path) => path.split('/')[1])
	.sort((a, b) => (a > b ? -1 : 1));

export async function generateKitEntries(): Promise<{ lang: Language; slug: string }[]> {
	return (
		await Promise.all(
			ids.map(async (id) => {
				const path = `./${id}/metadata.ts`;
				if (!metadataModules[path]) return null;
				const def = await metadataModules[path]();
				if (def('en').href.startsWith('http') || def('vi').href.startsWith('http')) return null;
				return [
					{ lang: 'en', slug: def('en').href.toString() },
					{ lang: 'vi', slug: def('vi').href.toString() },
				];
			}),
		)
	)
		.flat()
		.filter(Boolean);
}

export function getEventStatus(event: t.MinimalEventMetadata): t.EventStatus {
	const now = new Date();
	if (event.startDate instanceof Date && event.endDate instanceof Date) {
		if (now < event.startDate) return 'upcoming';
		if (now > event.endDate) return 'past';
		return 'ongoing';
	} else if (event.startDate instanceof Date) {
		if (now < event.startDate) return 'upcoming';
		return 'ongoing';
	} else if (event.endDate instanceof Date) {
		if (now > event.endDate) return 'past';
		return 'ongoing';
	} else {
		return 'upcoming';
	}
}

function compareEventsByStartDate(a: t.MinimalEventMetadata, b: t.MinimalEventMetadata): number {
	if (a.startDate === b.startDate) return 0;
	if (!(a.startDate instanceof Date) && !(b.startDate instanceof Date)) return 0;
	if (!(a.startDate instanceof Date)) return -1;
	if (!(b.startDate instanceof Date)) return 1;
	return (b.startDate?.getTime() ?? Infinity) - (a.startDate?.getTime() ?? Infinity);
}

export async function loadEventMetadata(
	id: string,
	lang: Language,
): Promise<t.EventMetadata | null> {
	const path = `./${id}/metadata.ts`;
	if (!metadataModules[path]) return null;
	const def = await metadataModules[path]();
	const event = def(lang);
	if (!event.thumbnail) {
		event.thumbnail = await loadEventThumbnail(id);
	}
	return {
		id,
		...event,
	};
}

export async function loadEventAdditionalStructuredData(
	id: string,
	lang: Language,
	origin: string,
): Promise<t.EventAdditionalStructuredData | null> {
	const path = `./${id}/additionalStructuredData.ts`;
	if (!additionalStructuredDataModules[path]) return null;
	const def = await additionalStructuredDataModules[path]();
	if (!def) return null;
	return def(lang, origin);
}

export async function loadEventThumbnail(id: string): Promise<Picture | undefined> {
	const path = `./${id}/images/thumbnail.jpg`;
	if (!thumbnailModules[path]) return undefined;
	return thumbnailModules[path]();
}

export async function loadEventOgImage(id: string): Promise<string | undefined> {
	const path = `./${id}/images/thumbnail.jpg`;
	if (!ogImageModules[path]) return undefined;
	return ogImageModules[path]();
}

export async function loadEventBySlug(
	slug: string,
	lang: Language,
): Promise<t.EventMetadata | null> {
	const metadatas = (await Promise.all(ids.map((id) => loadEventMetadata(id, lang)))).filter(
		Boolean,
	);
	const matched = metadatas.find((metadata) => metadata.href.toString() === slug);
	if (!matched) return null;
	return matched;
}

export async function loadEventContent(id: string): Promise<Component | null> {
	const path = `./${id}/content.svelte`;
	if (!contentModules[path]) return null;
	return contentModules[path]();
}

type EventLoadOptions = {
	lang: Language;
	where?: {
		status?: t.EventStatus | t.EventStatus[];
	};
	pagination?: { per: number; page: number };
};

export async function loadEvents(options: EventLoadOptions): Promise<{
	events: t.EventMetadata[];
	total: number;
}> {
	const { lang, where, pagination } = options;
	const metadatas = (await Promise.all(ids.map((id) => loadEventMetadata(id, lang)))).filter(
		Boolean,
	);
	const matched = metadatas.filter((metadata) => {
		if (where?.status) {
			const status = getEventStatus(metadata);
			if (Array.isArray(where.status)) {
				if (!where.status.includes(status)) return false;
			} else {
				if (status !== where.status) return false;
			}
		}
		return true;
	});
	let paginated = matched.sort(compareEventsByStartDate);
	if (pagination) {
		const { per, page } = pagination;
		paginated = matched.slice(per * (page - 1), per * page);
	}

	return {
		events: paginated,
		total: ids.length,
	};
}

export async function loadAllEvents(lang: Language): Promise<t.EventMetadata[]> {
	return Promise.all(ids.map((id) => loadEventMetadata(id, lang))).then((events) =>
		events.filter(Boolean).sort(compareEventsByStartDate),
	);
}

export async function loadEventsByPersonId(
	lang: Language,
	personId: string,
	page: number,
	per: number,
): Promise<{
	events: t.EventMetadata[];
	total: number;
}> {
	const metadatas = (await Promise.all(ids.map((id) => loadEventMetadata(id, lang)))).filter(
		Boolean,
	);
	const matched = metadatas.filter((metadata) => metadata.people?.includes(personId));
	return {
		events: matched.slice(per * (page - 1), per * page),
		total: matched.length,
	};
}

export function generateTimeSlot(
	startDate: string | Date,
	offsetMinutes: number,
	durationMinutes: number,
) {
	startDate = new Date(startDate);
	const ms = startDate.getTime() + offsetMinutes * 1_000 * 60;
	const slotStartDate = new Date(ms);
	const slotEndDate = new Date(ms + durationMinutes * 1_000 * 60);

	return `${formatTime(slotStartDate)} - ${formatTime(slotEndDate)}`;
}
