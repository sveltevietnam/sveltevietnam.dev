import * as t from './types';
export const EVENT_STATUSES = [
	'past',
	'ongoing',
	'upcoming',
] as const satisfies readonly t.EventStatus[];
