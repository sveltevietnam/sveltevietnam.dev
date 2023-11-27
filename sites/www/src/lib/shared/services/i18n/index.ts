export const LANGUAGES = ['en', 'vi'] as const;
export type Language = (typeof LANGUAGES)[number];
export type LangVar<T = string> = string | Record<Language, T>;

export function resolveLangVar<T>(lang: Language, v?: LangVar<T>): T {
	if (typeof v === 'object' && !Array.isArray(v)) {
		const r = v?.[lang];
		if (!r) throw new Error(`Missing language variant "${lang}" in ${JSON.stringify(v)}`);
		return r;
	}
	return v as T;
}
