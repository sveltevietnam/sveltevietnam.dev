import type { Component } from 'svelte';
import type { Picture } from 'vite-imagetools';

import { formatTime } from '$lib/utils/datetime';

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

export async function generateKitEntries(): Promise<{ lang: App.Language; slug: string }[]> {
	return (
		await Promise.all(
			ids.map(async (id) => {
				const path = `./${id}/metadata.ts`;
				if (!metadataModules[path]) return null;
				const def = await metadataModules[path]();
				return [
					{ lang: 'en', slug: def('en').slug.toString() },
					{ lang: 'vi', slug: def('vi').slug.toString() },
				];
			}),
		)
	)
		.flat()
		.filter(Boolean);
}

export async function loadEventMetadata(
	id: string,
	lang: App.Language,
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
	lang: App.Language,
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
	lang: App.Language,
): Promise<t.EventMetadata | null> {
	const metadatas = (await Promise.all(ids.map((id) => loadEventMetadata(id, lang)))).filter(
		Boolean,
	);
	const matched = metadatas.find((metadata) => metadata.slug.toString() === slug);
	if (!matched) return null;
	return matched;
}

export async function loadEventContent(id: string): Promise<Component | null> {
	const path = `./${id}/content.svelte`;
	if (!contentModules[path]) return null;
	return contentModules[path]();
}

export async function loadEvents(
	lang: App.Language,
	page: number,
	per: number,
): Promise<{
	events: t.EventMetadata[];
	total: number;
}> {
	return {
		events: (
			await Promise.all(
				ids.slice(per * (page - 1), per * page).map((id) => loadEventMetadata(id, lang)),
			)
		).filter(Boolean),
		total: ids.length,
	};
}

export async function loadAllEvents(lang: App.Language): Promise<t.EventMetadata[]> {
	return Promise.all(ids.map((id) => loadEventMetadata(id, lang))).then((events) =>
		events.filter(Boolean),
	);
}

export async function loadEventsByPersonId(
	lang: App.Language,
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
