import { test as base } from '@playwright/test';
import type { Language } from '@sveltevietnam/i18n';

import wranglerConfig from '../../wrangler.json' with { type: 'json' };

export interface WithCommonWorkerOptions {
	lang: Language;
	vars: (typeof wranglerConfig)['env']['test']['vars'];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const testWithCommon = base.extend<{}, WithCommonWorkerOptions>({
	lang: ['vi', { scope: 'worker', option: true }],
	vars: [wranglerConfig.env.test.vars, { scope: 'worker', option: true }],
});
