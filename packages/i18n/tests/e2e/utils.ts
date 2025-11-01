import process from 'node:process';

import {
	devices,
	defineConfig as _definePlaywrightConfig,
	expect,
	type Page,
	type Locator,
	type PlaywrightTestConfig,
} from '@playwright/test';

import type { langs } from './static/src/lib/i18n/generated/constants';
import * as m from './static/src/lib/i18n/generated/messages';

export function definePlaywrightConfig(): PlaywrightTestConfig {
	return _definePlaywrightConfig({
		testMatch: 'test.ts',
		webServer: {
			command: process.env.DEV ? 'pnpm dev' : 'pnpm build && pnpm preview',
			port: process.env.DEV ? 5173 : 4173,
		},
		projects: [
			{
				name: 'chromium',
				use: {
					...devices['Desktop Chrome'],
					screenshot: 'only-on-failure',
					trace: 'retain-on-failure',
				},
			},
		],
		forbidOnly: !!process.env.CI,
		retries: process.env.CI ? 3 : 0,
	});
}

const greet = m['components.welcome.greet'];
const goodbye = m['goodbye'];

export class PageObjectModel {
	readonly page: Page;
	readonly selectLang: Locator;
	readonly thKey: Locator;
	readonly thTranslation: Locator;
	readonly messages: Record<
		string,
		{
			key: Locator;
			translation: Locator;
		}
	>;

	constructor(page: Page) {
		this.page = page;
		this.selectLang = page.getByTestId('select-lang');
		this.thKey = page.getByTestId('key');
		this.thTranslation = page.getByTestId('translation');

		this.messages = {
			[greet.$k]: {
				key: page.getByRole('rowheader', { name: greet.$k }),
				translation: page.getByTestId(greet.$k),
			},
			[goodbye.$k]: {
				key: page.getByRole('rowheader', { name: goodbye.$k }),
				translation: page.getByTestId(goodbye.$k),
			},
		};
	}

	goto() {
		return this.page.goto('/');
	}

	changeLanguage(lang: (typeof langs)[number]) {
		return this.selectLang.selectOption(lang);
	}

	expect(lang: (typeof langs)[number]) {
		return Promise.all([
			expect(this.selectLang).toHaveValue(lang),
			expect(this.thKey).toHaveText(m['key'](lang)),
			expect(this.thTranslation).toHaveText(m['translation'](lang)),
			expect(this.messages[greet.$k].key).toBeVisible(),
			expect(this.messages[greet.$k].translation).toHaveText(greet(lang, { name: 'Hoàng' })),
			expect(this.messages[goodbye.$k].key).toBeVisible(),
			expect(this.messages[goodbye.$k].translation).toHaveText(goodbye(lang)),
		]);
	}
}
