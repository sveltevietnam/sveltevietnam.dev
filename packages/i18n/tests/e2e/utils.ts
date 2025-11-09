import process from 'node:process';

import {
	devices,
	defineConfig as _definePlaywrightConfig,
	expect,
	type Page,
	type Locator,
	type PlaywrightTestConfig,
} from '@playwright/test';

import type { MessageSimple, MessageWithParams } from '../../src/runtime';

export function definePlaywrightConfig(): PlaywrightTestConfig {
	return _definePlaywrightConfig({
		testMatch: 'test.ts',
		webServer: {
			command: process.env.DEV === 'true' ? 'pnpm dev' : 'pnpm build && pnpm preview',
			port: process.env.DEV === 'true' ? 5173 : 4173,
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

export class PageObjectModel {
	readonly path: string;
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
	private readonly m: {
		key: MessageSimple<string, 'key'>;
		translation: MessageSimple<string, 'translation'>;
		goodbye: MessageSimple<string, 'goodbye'>;
		'components.welcome.greet': MessageWithParams<string, 'components.welcome.greet', 'name'>;
	};

	constructor(page: Page, mapping: typeof this.m, path = '/') {
		this.path = path;
		this.m = mapping;
		this.page = page;
		this.selectLang = page.getByTestId('select-lang');
		this.thKey = page.getByTestId('key');
		this.thTranslation = page.getByTestId('translation');

		this.messages = {
			[this.m['components.welcome.greet'].$k]: {
				key: page.getByRole('rowheader', { name: this.m['components.welcome.greet'].$k }),
				translation: page.getByTestId(this.m['components.welcome.greet'].$k),
			},
			[this.m['goodbye'].$k]: {
				key: page.getByRole('rowheader', { name: this.m['goodbye'].$k }),
				translation: page.getByTestId(this.m['goodbye'].$k),
			},
		};
	}

	goto() {
		return this.page.goto(this.path);
	}

	changeLanguage(lang: string) {
		return this.selectLang.selectOption(lang);
	}

	expect(lang: string) {
		return Promise.all([
			expect(this.selectLang).toHaveValue(lang),
			expect(this.thKey).toHaveText(this.m['key'](lang)),
			expect(this.thTranslation).toHaveText(this.m['translation'](lang)),
			expect(this.messages[this.m['components.welcome.greet'].$k].key).toBeVisible(),
			expect(this.messages[this.m['components.welcome.greet'].$k].translation).toHaveText(
				this.m['components.welcome.greet'](lang, { name: 'Hoàng' }),
			),
			expect(this.messages[this.m['goodbye'].$k].key).toBeVisible(),
			expect(this.messages[this.m['goodbye'].$k].translation).toHaveText(this.m['goodbye'](lang)),
		]);
	}
}
