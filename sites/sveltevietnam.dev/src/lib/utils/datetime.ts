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

	const seconds = Math.floor(diff / 1000);
	if (seconds < 60) return `${seconds}s`;

	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m`;

	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h`;

	const days = Math.floor(hours / 24);
	if (days < 30) return `${days}d`;

	const months = Math.floor(days / 30);
	if (months < 12) return `${months}mo`;

	const years = Math.floor(months / 12);
	return `${years}y`;
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
