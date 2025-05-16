import type { Language } from '@sveltevietnam/i18n';

import { DEFAULT_VARS } from './constants';
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

export async function loadTemplate(id: t.TemplateId, lang: Language): Promise<t.Template | null> {
	const path = `./${id}/index.ts`;
	if (!modules[path]) return null;
	const def = await modules[path]();
	const template = def(lang);
	return {
		...template,
		from: {
			email: template.from?.email ?? DEFAULT_VARS[lang].from.email,
			name: template.from?.name ?? DEFAULT_VARS[lang].from.name,
		},
		id,
	};
}

export type * from './types';
