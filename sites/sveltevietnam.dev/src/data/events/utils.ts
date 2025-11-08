import { formatTime } from '@sveltevietnam/kit/utilities/datetime';

import * as t from './types';

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

export function compareEventsByStartDate(
	a: t.MinimalEventMetadata,
	b: t.MinimalEventMetadata,
): number {
	if (a.startDate === b.startDate) return 0;
	if (!(a.startDate instanceof Date) && !(b.startDate instanceof Date)) return 0;
	if (!(a.startDate instanceof Date)) return -1;
	if (!(b.startDate instanceof Date)) return 1;
	return (b.startDate?.getTime() ?? Infinity) - (a.startDate?.getTime() ?? Infinity);
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
