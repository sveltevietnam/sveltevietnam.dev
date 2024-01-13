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

export function formatDateAndTime(date: Date | number | string): string {
	if (!isValidDate(date)) return date.toString();
	date = new Date(date);
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
