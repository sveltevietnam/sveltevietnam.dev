import { expect, type Locator } from '@playwright/test';

import type { TestWithBackendWorkerFixtures } from '../fixtures/with-backend';

import { CommonPageObjectModel, type CommonPageObjectModelInit } from './utils';

export interface PageMailInit extends CommonPageObjectModelInit {
	mails: TestWithBackendWorkerFixtures['mails'];
	d1: TestWithBackendWorkerFixtures['d1'];
}

export class PageMail extends CommonPageObjectModel {
	private readonly mails: TestWithBackendWorkerFixtures['mails'];
	private readonly d1: TestWithBackendWorkerFixtures['d1'];

	private readonly timeoutForBackendQueue = 100;

	constructor(init: PageMailInit) {
		super(init);
		this.mails = init.mails;
		this.d1 = init.d1;
	}

	private async open(html: string) {
		await this.page.evaluate((mailHtml) => {
			document.documentElement.innerHTML = mailHtml!;
		}, html);
	}

	private async click(link: Locator) {
		await expect(link).toBeVisible();
		const url = await link.getAttribute('href');
		expect(url).not.toBeFalsy();
		await this.page.goto(url!);
	}

	public async onboard(email: string) {
		// 1. User receives and opens onboarding email
		await this.page.waitForTimeout(this.timeoutForBackendQueue);
		const html = await this.mails.getLatest(email, 'recruit-employer-onboard');
		await this.open(html);

		// 2. User clicks onboarding link in email
		const onboardLink = this.page.getByRole('link', {
			name: this.lang === 'vi' ? 'Hoàn thiện hồ sơ' : 'Complete your profile',
		});
		await this.click(onboardLink);
	}

	public async login(email: string) {
		// Get employer DB record by email
		const employer = await this.d1.query.employers.findFirst({
			columns: { id: true },
			where: (table, { eq }) => eq(table.email, email),
		});
		expect(employer).toBeTruthy();

		// 1. User receives and opens login email
		await this.page.waitForTimeout(this.timeoutForBackendQueue);
		const html = await this.mails.getLatest(email, 'recruit-employer-login', employer!.id);
		await this.open(html);

		// 2. User clicks login link in email
		const link = this.page.getByRole('link', {
			name: this.lang === 'vi' ? 'Đăng nhập' : 'Login',
		});
		await this.click(link);
	}
}
