export const LANGUAGES = ['en', 'vi'] as const;
export type Language = (typeof LANGUAGES)[number];
export const DEFAULT_LANG = 'en' satisfies Language;

export type LangVar<T = string> = T | Record<Language, T>;

export function localizeLangVar<T>(lang: Language, v?: LangVar<T>): T {
	if (
		typeof v === 'object' &&
		!Array.isArray(v) &&
		LANGUAGES.some((l) => l in (v as Record<Language, T>))
	) {
		const r = (v as Record<Language, T>)[lang] ?? null;
		if (r === null) throw new Error(`Missing language variant "${lang}" in ${JSON.stringify(v)}`);
		return r;
	}
	return v as T;
}

export function delocalizeLangVar<T>(v: LangVar<T>): Record<Language, T> {
	if (
		typeof v === 'object' &&
		!Array.isArray(v) &&
		LANGUAGES.every((l) => l in (v as Record<Language, T>))
	) {
		return v as Record<Language, T>;
	}
	return LANGUAGES.reduce(
		(acc, l) => {
			acc[l] = v as T;
			return acc;
		},
		{} as Record<Language, T>,
	);
}
