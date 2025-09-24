import { Faker, en, base } from '@faker-js/faker';
import { test as testBase } from '@playwright/test';
import * as schema from '@sveltevietnam/backend/db/schema';
import type { Language } from '@sveltevietnam/i18n';

import wranglerConfig from '../../wrangler.json' with { type: 'json' };

export interface TestWorkerOptions {
	lang: Language;
	vars: (typeof wranglerConfig)['env']['test']['vars'];
}
export interface TestWorkerFixtures {
	faker: Faker;
}

export const test = testBase.extend<
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	{},
	TestWorkerFixtures & TestWorkerOptions
>({
	lang: ['vi', { scope: 'worker', option: true }],
	vars: [wranglerConfig.env.test.vars, { scope: 'worker', option: true }],
	faker: [
		// eslint-disable-next-line no-empty-pattern
		async ({}, use, workerInfo) => {
			const faker = new Faker({
				seed: 42 + workerInfo.parallelIndex,
				locale: [en, base],
			});
			await use(faker);
		},
		{ scope: 'worker' },
	],
});

export { schema };
