import { LANGUAGES } from '@internals/utils/language';

export type LangVar<T = string> = T | Record<App.Language, T>;

export function localizeLangVar<T>(lang: App.Language, v?: LangVar<T>): T {
	if (
		typeof v === 'object' &&
		!Array.isArray(v) &&
		LANGUAGES.some((l) => l in (v as Record<App.Language, T>))
	) {
		const r = (v as Record<App.Language, T>)[lang] ?? null;
		if (r === null) throw new Error(`Missing language variant "${lang}" in ${JSON.stringify(v)}`);
		return r;
	}
	return v as T;
}

export function delocalizeLangVar<T>(v: LangVar<T>): Record<App.Language, T> {
	if (
		typeof v === 'object' &&
		!Array.isArray(v) &&
		LANGUAGES.every((l) => l in (v as Record<App.Language, T>))
	) {
		return v as Record<App.Language, T>;
	}
	return LANGUAGES.reduce(
		(acc, l) => {
			acc[l] = v as T;
			return acc;
		},
		{} as Record<App.Language, T>,
	);
}
