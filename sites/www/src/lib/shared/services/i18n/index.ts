export const LANGUAGES = ['en', 'vi'] as const;
export type Language = (typeof LANGUAGES)[number];
export type LangText = string | Record<Language, string>;

export function resolveLangText(lang: Language, text?: LangText): string {
  if (typeof text === 'string') return text;
  return text?.[lang] ?? '';
}

