export const LANGUAGES = ['en', 'vi'] as const;
export type Language = (typeof LANGUAGES)[number];
export type LangVar<T = string> = string | Record<Language, T>;

export function localizeLangVar<T>(lang: Language, v?: LangVar<T>): T {
	if (typeof v === 'object' && !Array.isArray(v) && LANGUAGES.some((l) => l in v)) {
		const r = v?.[lang] ?? null;
		if (r === null) throw new Error(`Missing language variant "${lang}" in ${JSON.stringify(v)}`);
		return r;
	}
	return v as T;
}
