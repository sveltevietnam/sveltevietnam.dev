/**
 * https://www.w3.org/TR/NOTE-datetime
 * @param date
 * @returns
 */
export function toW3CDate(date: Date | number): string {
	date = new Date(date);
	return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
		.getDate()
		.toString()
		.padStart(2, '0')}`;
}

export function isValidDate(str: Date | number | string) {
	return !isNaN(new Date(str).getTime());
}

export function formatTimeDiff(date1: Date | number | string, date2 = new Date()) {
	if (!isValidDate(date1) || !isValidDate(date2)) return 'invalid date(s)';
	date1 = new Date(date1);
	date2 = new Date(date2);
	const diff = Math.abs(date1.getTime() - date2.getTime());

	const seconds = diff / 1000;
	if (seconds < 60) return `${Math.floor(seconds)}s`;

	const minutes = seconds / 60;
	if (minutes < 60) return `${Math.floor(minutes)}m`;

	const hours = minutes / 60;
	if (hours < 24) return `${Math.floor(hours)}h`;

	const days = hours / 24;
	if (days < 30) return `${Math.floor(days)}d`;

	const months = days / 30;
	if (months < 12) return `${Math.floor(months)}mo`;

	const years = months / 12;
	return `${Math.floor(years)}y`;
}

/**
 * format date to YYYY.MM.DD
 */
export function formatDate(date: Date | number | string): string {
	if (!isValidDate(date)) return date.toString();
	date = new Date(date);
	return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date
		.getDate()
		.toString()
		.padStart(2, '0')}`;
}

export function formatFullDateAndTime(lang: App.Language, date: Date | number | string): string {
	if (!isValidDate(date)) return date.toString();
	date = new Date(date);
	const formatter = Intl.DateTimeFormat(lang, {
		timeStyle: 'long',
		hour12: false,
		dateStyle: 'full',
	});
	return formatter.format(date);
}

/**
 * format time to HH:MM
 */
export function formatTime(date: Date | number | string): string {
	if (!isValidDate(date)) return date.toString();
	date = new Date(date);
	return `${date.getHours().toString().padStart(2, '0')}:${date
		.getMinutes()
		.toString()
		.padStart(2, '0')}`;
}

export function formatDateAndTime(
	date: Date | number | string,
	order: 'date-first' | 'time-first' = 'date-first',
): string {
	if (!isValidDate(date)) return date.toString();
	date = new Date(date);
	if (order === 'time-first') return `${formatTime(date)} ${formatDate(date)}`;
	return `${formatDate(date)} ${formatTime(date)}`;
}

export function formateDateForBlog(lang: App.Language, date: Date | number | string): string {
	if (!isValidDate(date)) return date.toString();
	const str = new Date(date).toLocaleDateString(lang, {
		month: 'long',
		year: 'numeric',
	});
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * ms is directional (negative for past, positive for future)
 */
export function formatRelativeTime(lang: App.Language, ms: number) {
	const rtf = new Intl.RelativeTimeFormat(lang, { style: 'long' });

	const seconds = ms / 1000;
	if (Math.abs(seconds) < 60)
		return rtf.format(Math.sign(seconds) * Math.floor(Math.abs(seconds)), 'seconds');

	const minutes = seconds / 60;
	if (Math.abs(minutes) < 60)
		return rtf.format(Math.sign(minutes) * Math.floor(Math.abs(minutes)), 'minutes');

	const hours = minutes / 60;
	if (Math.abs(hours) < 24)
		return rtf.format(Math.sign(hours) * Math.floor(Math.abs(hours)), 'hours');

	const days = hours / 24;
	if (Math.abs(days) < 30) return rtf.format(Math.sign(days) * Math.floor(Math.abs(days)), 'days');

	const months = days / 30;
	if (Math.abs(months) < 12)
		return rtf.format(Math.sign(months) * Math.floor(Math.abs(months)), 'months');

	const years = months / 12;
	return rtf.format(Math.sign(years) * Math.floor(Math.abs(years)), 'years');
}

/**
 * Format month in localized long format
 */
export function formatLongMonth(lang: App.Language, date: Date | number | string): string {
	if (!isValidDate(date)) return date.toString();
	date = new Date(date);
	const formatter = Intl.DateTimeFormat(lang, {
		month: 'long',
	});
	return formatter.format(date);
}

/**
 * Format weekday in localized long format
 */
export function formatLongWeekDay(lang: App.Language, date: Date | number | string) {
	if (!isValidDate(date)) return date.toString();
	date = new Date(date);
	const formatter = Intl.DateTimeFormat(lang, {
		weekday: 'long',
	});
	return formatter.format(date);
}
