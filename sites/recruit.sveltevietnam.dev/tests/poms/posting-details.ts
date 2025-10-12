import { expect, type Locator, type Page } from '@playwright/test';
import { formatDate } from '@sveltevietnam/kit/utilities/datetime';
import jsQR from 'jsqr';

import * as m from '../../src/data/locales/generated/messages';
import * as p from '../../src/data/routes/generated';
import * as b from '../../src/data/routes/generated/breadcrumbs';
import { JOB_POSTING_TYPE_LABEL } from '../../src/lib/forms/job-posting-upsert/schema';
import { type schema } from '../fixtures/with-backend';

import { CommonPageObjectModel, type CommonPageObjectModelInit } from './common';

export interface PagePostingDetailsInit extends CommonPageObjectModelInit {
	id: string;
}

type RGBA = {
	width: number;
	height: number;
	data: Uint8ClampedArray;
};
async function imageToRGBA(page: Page, image: Buffer | string): Promise<RGBA> {
	let src = `data:image/png;base64,`;
	if (Buffer.isBuffer(image)) {
		src += image.toString('base64');
	} else {
		src = image;
	}
	return await page.evaluate(
		({ src }) => {
			return new Promise<RGBA>((res) => {
				const image = new Image();
				image.onload = () => {
					const canvas = new OffscreenCanvas(image.width, image.height);
					const ctx = canvas.getContext('2d');
					if (!ctx) throw new Error('Cannot get canvas context');
					ctx.drawImage(image, 0, 0);
					const imageData = ctx.getImageData(0, 0, image.width, image.height);
					res({
						width: image.width,
						height: image.height,
						data: imageData.data,
					});
				};
				image.src = src;
			});
		},
		{ src },
	);
}

export class PagePostingDetails extends CommonPageObjectModel {
	public readonly path: string;
	public readonly id: string;

	public readonly employer: {
		name: Locator;
		image: Locator;
		description: Locator;
	};
	public readonly posting: {
		title: Locator;
		type: Locator;
		location: Locator;
		salary: Locator;
		postedAt: Locator;
		expiredAt: Locator;
		description: Locator;
	};
	public readonly actions: {
		apply: Locator;
		copyLink: Locator;
		generateQR: Locator;
		delete: Locator;
		edit: Locator;
	};
	public readonly callout: {
		pending: Locator;
		deleted: Locator;
	};

	constructor(init: PagePostingDetailsInit) {
		super(init);
		this.id = init.id;
		this.path = p['/:lang/postings/:id']({ lang: this.lang, id: this.id });

		this.employer = {
			name: this.page.getByTestId('employer-name'),
			image: this.page.getByTestId('employer-image'),
			description: this.page.getByTestId('employer-description'),
		};

		this.posting = {
			title: this.page.getByRole('heading', { level: 1 }),
			type: this.page.getByTestId('job-type'),
			location: this.page.getByTestId('job-location'),
			salary: this.page.getByTestId('job-salary'),
			postedAt: this.page.getByTestId('job-posted-at'),
			expiredAt: this.page.getByTestId('job-expired-at'),
			description: this.page.getByTestId('job-description'),
		};

		this.actions = {
			apply: this.page.getByRole('button', {
				name: m['pages.postings_id.actions.apply'](this.lang).toString(),
			}),
			copyLink: this.page.getByRole('button', {
				name: m['pages.postings_id.actions.share.link'](this.lang).toString(),
			}),
			generateQR: this.page.getByRole('button', {
				name: m['pages.postings_id.actions.share.qr'](this.lang).toString(),
			}),
			delete: this.page.getByRole('button', {
				name: m['pages.postings_id.manage.delete'](this.lang).toString(),
			}),
			edit: this.page.getByRole('link', {
				name: m['pages.postings_id.manage.edit'](this.lang).toString(),
			}),
		};

		this.callout = {
			pending: this.page.getByRole('note').filter({
				hasText: m['pages.postings_id.pending'](this.lang).toString(),
			}),
			deleted: this.page.getByRole('note').filter({
				hasText: m['pages.postings_id.deleted'](this.lang).toString(),
			}),
		};
	}

	async match(data: {
		employer: (typeof schema.employers)['$inferSelect'];
		posting: (typeof schema.jobPostings)['$inferSelect'];
	}) {
		const { employer, posting } = data;
		await Promise.all([
			// employer
			employer.website
				? expect(this.employer.name.getByRole('link', { name: employer.name })).toHaveAttribute(
						'href',
						employer.website,
					)
				: expect(this.employer.name).toHaveText(employer.name),
			employer.image
				? expect(this.employer.image).toHaveAttribute('src', employer.image)
				: expect(this.employer.image).toBeHidden(),
			employer.description && expect(this.employer.description).toHaveText(/\w+/),

			// posting
			expect(this.posting.title).toHaveText(posting.title),
			expect(this.posting.type).toHaveText(
				JOB_POSTING_TYPE_LABEL[posting.type](this.lang).toString(),
			),
			expect(this.posting.location).toHaveText(posting.location),
			expect(this.posting.salary).toHaveText(posting.salary),
			posting.approvedAt
				? expect(this.posting.postedAt).toHaveText(
						`${m['pages.postings_id.general.posted_at'](this.lang).toString()} ${formatDate(posting.approvedAt)}`,
					)
				: expect(this.posting.postedAt).toBeHidden(),
			expect(this.posting.expiredAt).toHaveText(
				`${m['pages.postings_id.general.expired_at'](this.lang).toString()} ${formatDate(posting.expiredAt)}`,
			),
			posting.description && expect(this.posting.description).toHaveText(/\w+/),
		]);
	}

	async backToListing(): Promise<import('./posting-list').PagePostingList> {
		const breadcrumbs = this.page.getByRole('navigation', {
			name: m['components.breadcrumbs.aria'](this.lang).toString(),
		});
		await expect(breadcrumbs).toBeVisible();
		const link = breadcrumbs.getByRole('link', {
			name: b['/:lang/postings']({ lang: this.lang }).at(-1)?.name,
		});
		await expect(link).toBeVisible();
		link.click();
		const { PagePostingList } = await import('./posting-list');
		const pagePostingList = new PagePostingList({ page: this.page, lang: this.lang });
		await pagePostingList.waitForPage();
		return pagePostingList;
	}

	async edit(): Promise<import('./posting-edit').PagePostingEdit> {
		await expect(this.actions.edit).toBeVisible();
		this.actions.edit.click();
		const { PagePostingEdit } = await import('./posting-edit');
		const pomPostingEdit = new PagePostingEdit({ page: this.page, lang: this.lang, id: this.id });
		await pomPostingEdit.waitForPage();
		return pomPostingEdit;
	}

	async delete() {
		// User clicks "Delete" button
		await expect(this.actions.delete).toBeVisible();
		this.actions.delete.click();

		// User sees confirmation dialog
		const dialog = this.page.getByRole('dialog');
		await expect(dialog).toBeVisible();

		// User clicks "cancel"
		const cancelButton = dialog.getByRole('button', {
			name: m['pages.postings_id.delete.confirmation.cancel'](this.lang).toString(),
		});
		await expect(cancelButton).toBeVisible();
		cancelButton.click();

		// User sees dialog closed
		await expect(dialog).toBeHidden();

		// User clicks "Delete" button again
		this.actions.delete.click();
		await expect(dialog).toBeVisible();

		// User clicks "confirm"
		const confirmButton = dialog.getByRole('button', {
			name: m['pages.postings_id.delete.confirmation.confirm'](this.lang).toString(),
		});
		await expect(confirmButton).toBeVisible();
		confirmButton.click();

		// User sees alert of success deletion
		const alert = this.page.getByRole('alert').filter({
			hasText: m['pages.postings_id.delete.success'](this.lang).toString(),
		});
		await expect(alert).toBeVisible();
	}

	getPublicUrl() {
		return process.env.VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN + `/${this.lang}/jobs/${this.id}`;
	}

	async copyLink(): Promise<string> {
		await expect(this.actions.copyLink).toBeVisible();
		await this.page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
		await this.actions.copyLink.click();
		const clipboardContent = await this.page.evaluate(() => navigator.clipboard.readText());
		await this.page.waitForTimeout(500);
		expect(clipboardContent).toBe(this.getPublicUrl());
		return clipboardContent;
	}

	async generateQR(): Promise<string> {
		// User clicks "Generate QR" button
		await expect(this.actions.generateQR).toBeVisible();
		this.actions.generateQR.click();

		// User sees dialog with QR code
		const dialog = this.page.getByRole('dialog');
		await expect(dialog).toBeVisible();

		// User scans the QR code
		const svg = dialog.getByRole('img', { name: 'QR' });
		const buffer = await svg.screenshot();

		// User expects the QR code to contain the public URL
		let rgba = await imageToRGBA(this.page, buffer);
		let code = jsQR(rgba.data, rgba.width, rgba.height);
		expect(code).not.toBeNull();
		expect(code!.data).toBe(this.getPublicUrl());

		// User downloads the QR code
		const downloadPromise = this.page.waitForEvent('download');
		await dialog.getByRole('link', { name: m['download'](this.lang).toString() }).click();
		const download = await downloadPromise;

		// User expects the QR code to contain the public URL
		rgba = await imageToRGBA(this.page, download.url());
		code = jsQR(rgba.data, rgba.width, rgba.height);
		expect(code).not.toBeNull();
		expect(code!.data).toBe(this.getPublicUrl());

		// User closes the dialog
		await dialog.getByRole('button', { name: m['close'](this.lang).toString() }).click();

		return code!.data;
	}
}
