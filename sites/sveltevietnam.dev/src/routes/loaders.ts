import type { Message } from '@sveltevietnam/i18n/runtime';

type GenericLocaleModule = Record<string, Message<never>>;

const localeModules = import.meta.glob<(lang: string) => GenericLocaleModule>(
	'./**/_page/locales/generated/index.js',
	{
		import: 'loadLocale',
	},
);

const ogModules = import.meta.glob<string>(
	'./**/_page/og*.jpg',
	{
		import: 'default',
		query: '?url',
	},
)

export async function getPageLocaleModule(routeId: string, lang: string): Promise<GenericLocaleModule | null> {
	const path = '.' + routeId + '/_page/locales/generated/index.js';
	if (!(path in localeModules)) return null;
	return (await localeModules[path]())(lang);
}

export async function getOgImagePath(routeId: string, lang: string): Promise<string | undefined> {
	const dirpath = '.' + routeId + '/_page';
	let path = dirpath + `/og.${lang}.jpg`;
	if (!(path in ogModules)) {
		path = dirpath + `/og.jpg`;
		if (!(path in ogModules)) return undefined;
	}
	return ogModules[path]();
}

