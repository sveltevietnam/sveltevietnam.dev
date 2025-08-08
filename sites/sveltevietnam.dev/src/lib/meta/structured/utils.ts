import type { Language } from '@sveltevietnam/i18n';
import type { Thing, WithContext } from 'schema-dts';

export function withContext<T extends Thing>(data: T) {
	return {
		'@context': 'https://schema.org',
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		...(data as any),
	} satisfies WithContext<T>;
}

export function toStringWithContext<T extends Thing>(data: T | T[]): string {
	if (Array.isArray(data)) {
		return JSON.stringify(data.map(withContext));
	}
	return JSON.stringify(withContext(data));
}

export function buildStructuredTextWithLang(lang: Language, value: string) {
	return {
		'@language': lang,
		'@value': value,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any;
}
