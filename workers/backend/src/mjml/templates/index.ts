import type { Language } from '@sveltevietnam/i18n';

import * as t from './types';
import { TemplateVars as WelcomTemplateVars } from './welcome';

export function defineTemplate(def: t.TemplateDefinition): t.TemplateDefinition {
	return def;
}

const modules = import.meta.glob<t.TemplateDefinition>('./*/index.ts', {
	import: 'default',
});

export type TemplateVarMap = {
	welcome: WelcomTemplateVars;
};

export const NO_REPLY_EMAIL = 'no-reply@sveltevietnam.dev';
const DEFAULTS = {
	en: {
		from: {
			email: NO_REPLY_EMAIL,
			name: 'Svelte Vietnam',
		},
	},
	vi: {
		from: {
			email: NO_REPLY_EMAIL,
			name: 'Svelte Việt Nam',
		},
	},
};
export async function loadTemplate(id: TemplateId, lang: Language): Promise<t.Template | null> {
	const path = `./${id}/index.ts`;
	if (!modules[path]) return null;
	const def = await modules[path]();
	const template = def(lang);
	return {
		...template,
		from: {
			email: template.from?.email ?? DEFAULTS[lang].from.email,
			name: template.from?.name ?? DEFAULTS[lang].from.name,
		},
		id,
	};
}

export type * from './types';
