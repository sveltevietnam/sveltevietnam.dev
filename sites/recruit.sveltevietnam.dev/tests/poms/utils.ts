import { expect, type Locator, type Page } from '@playwright/test';
import type { Language } from '@sveltevietnam/i18n';

import * as m from '../../src/data/locales/generated/messages';
import * as p from '../../src/data/routes/generated';

import { type PageProfile } from './profile';

export interface CommonPageObjectModelInit {
	page: Page;
	/** @default vi' */
	lang?: Language;
}

export class CommonPageObjectModel {
	public readonly page: Page;
	public readonly lang: Language;
	public readonly accountMenu: {
		locator: Locator;
		open: () => Promise<void>;
		checkOpenState(expected: boolean): Promise<void>;
		goToProfile: () => Promise<PageProfile>;
		logout: () => Promise<void>;
	};

	constructor(init: CommonPageObjectModelInit) {
		this.page = init.page;
		this.lang = init.lang || 'vi';

		this.accountMenu = {
			locator: this.page.getByRole('navigation', {
				name: m['components.account_menu.aria'](this.lang).toString(),
			}),

			checkOpenState: async (expected) => {
				const open = await this.accountMenu.locator.evaluate(
					(el) => (el as HTMLDetailsElement).open,
				);
				if (expected) expect(open).toBeTruthy();
				else expect(open).toBeFalsy();
			},

			open: async () => {
				expect(this.accountMenu.locator).toBeVisible();
				await this.accountMenu.locator.click();
				await this.accountMenu.checkOpenState(true);
			},

			goToProfile: async () => {
				// 1. User opens account menu
				await this.accountMenu.open();

				// 2. User clicks "Profile" link in account menu
				const link = this.accountMenu.locator.getByRole('link', {
					name: m['components.account_menu.profile'](this.lang).toString(),
				});
				link.click();

				// 3. User is redirected to profile page
				const { PageProfile } = await import('./profile');
				const pomProfile = new PageProfile({ page: this.page, lang: this.lang });
				await this.page.waitForURL(p['/:lang/profile']({ lang: this.lang }));
				await this.accountMenu.checkOpenState(false);
				return pomProfile;
			},

			logout: async () => {
				// 1. User opens account menu
				await this.accountMenu.open();

				// 2. User clicks "Logout" link in account menu
				const link = this.accountMenu.locator.getByRole('link', {
					name: m['components.account_menu.logout'](this.lang).toString(),
				});
				link.click();

				// 3. User is redirected to authentication page
				await this.page.waitForURL(p['/:lang/authenticate']({ lang: this.lang }));
				await expect(this.accountMenu.locator).toBeHidden();
			},
		};
	}
}
