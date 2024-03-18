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

function isValidDate(str: Date | number | string) {
	return !isNaN(new Date(str).getTime());
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
