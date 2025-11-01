import { expect, type Locator, type Page } from '@playwright/test';
import { EMAILS, type Language } from '@sveltevietnam/kit/constants';

import type { WithBackendWorkerArgs, schema } from '../fixtures/with-backend';

export interface PageMailInit {
	lang: Language;
	page: Page;
	mails: WithBackendWorkerArgs['mails'];
	d1: WithBackendWorkerArgs['d1'];
}

export class PageMail {
	private readonly lang: Language;
	private readonly page: Page;
	private readonly mails: WithBackendWorkerArgs['mails'];
	private readonly d1: WithBackendWorkerArgs['d1'];

	private readonly timeoutForBackendQueue = 1000;

	constructor(init: PageMailInit) {
		this.lang = init.lang;
		this.page = init.page;
		this.mails = init.mails;
		this.d1 = init.d1;
	}

	private async open(html: string) {
		await this.page.evaluate((mailHtml) => {
			document.documentElement.innerHTML = mailHtml!;
		}, html);
	}

	private async click(link: Locator): Promise<string> {
		await expect(link).toBeVisible();
		const url = await link.getAttribute('href');
		expect(url).not.toBeFalsy();
		await this.page.goto(url!);
		return url!;
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

	private async getEmployer(email: string): Promise<typeof schema.employers.$inferSelect> {
		// Get employer DB record by email
		const employer = await this.d1.transaction((tx) =>
			tx.query.employers.findFirst({
				where: (table, { eq }) => eq(table.email, email.toLowerCase()),
			}),
		);
		expect(employer).toBeTruthy();
		return employer!;
	}

	public async login(email: string) {
		const employer = await this.getEmployer(email);

		// 1. User receives and opens login email
		await this.page.waitForTimeout(this.timeoutForBackendQueue);
		const html = await this.mails.getLatest(email, 'recruit-employer-login', employer.id);
		await this.open(html);

		// 2. User clicks login link in email
		const link = this.page.getByRole('link', {
			name: this.lang === 'vi' ? 'Đăng nhập' : 'Login',
		});
		await this.click(link);
	}

	public async verifyEmailChange(
		email: string,
	): Promise<import('./email-change-verification').PageEmailChangeVerification> {
		const employer = await this.getEmployer(email);

		// 1. User receives and open email
		await this.page.waitForTimeout(this.timeoutForBackendQueue / 2);
		const html = await this.mails.getLatest(email, 'recruit-employer-change-email', employer.id);
		await this.open(html);

		// 2. User clicks verify link in email
		const link = this.page.getByRole('link', {
			name: this.lang === 'vi' ? 'Xác nhận' : 'Verify change',
		});
		const url = new URL(await this.click(link));
		const token = url.pathname.split('/').pop()!;

		// 3. User is redirected to email change verification page
		const { PageEmailChangeVerification } = await import('./email-change-verification');
		const pomEmailChangeVerification = new PageEmailChangeVerification({
			page: this.page,
			lang: this.lang,
			token,
		});
		await pomEmailChangeVerification.waitForPage();
		return pomEmailChangeVerification;
	}

	public async approveJobPostingAsAdmin() {
		// 1. Admin receives and open job posting approval email
		await this.page.waitForTimeout(this.timeoutForBackendQueue);
		const html = await this.mails.getLatest(
			EMAILS.JOBS,
			'recruit-admin-job-posting-pending-approval',
		);
		await this.open(html);

		// 2. Admin clicks approve link in email
		const link = this.page.getByRole('link', {
			name: 'Approve this posting',
		});
		await this.click(link);
		await this.page.waitForLoadState('networkidle');
	}
}
