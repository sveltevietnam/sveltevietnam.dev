export const LANGUAGES = ['en', 'vi'] as const;
export type Language = (typeof LANGUAGES)[number];
export type LangVar<T = string> = string | Record<Language, T>;

export function resolveLangVar<T>(lang: Language, v?: LangVar<T>): T | undefined {
	if (typeof v === 'object' && !Array.isArray(v)) return v?.[lang] ?? undefined;
	return v as T;
}
