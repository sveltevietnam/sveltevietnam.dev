import { Faker, en, base } from '@faker-js/faker';
import { test as testBase } from '@playwright/test';

export interface WithFakerArgs {
	/**
	 * use this if Faker instance is needed in per-test context,
	 * for example if test is using snapshots
	 */
	testFaker: Faker;
}

export interface WithFakerWorkerArgs {
	/**
	 * use this if Faker instance is needed in per-worker context,
	 * for example to generate a different email for each test in a suite
	 * that doesn't need to be cleaned up in database (avoid UNIQUE constraint error)
	 */
	workerFaker: Faker;
}

export const testWithFaker = testBase.extend<WithFakerArgs, WithFakerWorkerArgs>({
	workerFaker: [
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
	testFaker: [
		// eslint-disable-next-line no-empty-pattern
		async ({}, use, testInfo) => {
			const faker = new Faker({
				seed: 42 + testInfo.parallelIndex,
				locale: [en, base],
			});
			await use(faker);
		},
		{ scope: 'test' },
	],
});
