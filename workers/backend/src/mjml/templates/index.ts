import type { Language } from '@sveltevietnam/i18n';

import { DEFAULT_VARS } from './constants';
import { RecruitAdminJobPostingPendingApprovalVars } from './recruit-admin-job-posting-pending-approval';
import type { RecruitEmployerChangeEmailVars } from './recruit-employer-change-email';
import type { RecruitEmployerCreateJobPostingVars } from './recruit-employer-create-job-posting';
import type { RecruitEmployerCreateJobPostingApprovedVars } from './recruit-employer-job-posting-approved';
import type { RecuirtEmployerLoginVars } from './recruit-employer-login';
import type { RecruitEmployerOnboardVars } from './recruit-employer-onboard';
import * as t from './types';
import type { WelcomTemplateVars } from './welcome';

export function defineTemplate(def: t.TemplateDefinition): t.TemplateDefinition {
	return def;
}

const modules = import.meta.glob<t.TemplateDefinition>('./*/index.ts', {
	import: 'default',
});

export type TemplateVarMap = {
	welcome: WelcomTemplateVars;
	'recruit-employer-onboard': RecruitEmployerOnboardVars;
	'recruit-employer-login': RecuirtEmployerLoginVars;
	'recruit-employer-change-email': RecruitEmployerChangeEmailVars;
	'recruit-employer-create-job-posting': RecruitEmployerCreateJobPostingVars;
	'recruit-admin-job-posting-pending-approval': RecruitAdminJobPostingPendingApprovalVars;
	'recruit-employer-job-posting-approved': RecruitEmployerCreateJobPostingApprovedVars;
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
