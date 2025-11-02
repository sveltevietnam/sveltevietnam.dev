import {
	JOB_POSTING_TYPES,
	JOB_POSTING_APPLICATION_METHODS,
	type JobPostingType,
	type JobPostingApplicationMethod,
} from '@sveltevietnam/backend/data/job-postings/enums';
import type { KeySimple } from '@sveltevietnam/i18n/generated';
import type { Language } from '@sveltevietnam/kit/constants';
import * as v from 'valibot';

// referencing output modules directly because this is also imported
// by UAT tests, which live outside of Vite
import * as m from '$lib/i18n/generated/messages';

export {
	type JobPostingType,
	type JobPostingApplicationMethod,
	JOB_POSTING_TYPES,
	JOB_POSTING_APPLICATION_METHODS,
};

export const JOB_POSTING_MAX_EXPIRATION_MS = 180 * 24 * 60 * 60 * 1000; // 180 days

export function createJobPostingApplicationSchema(lang: Language) {
	return v.variant('method', [
		v.object({
			method: v.literal('email' satisfies JobPostingApplicationMethod),
			link: v.pipe(
				v.string(),
				v.nonEmpty(m['inputs.job_posting.application.errors.nonempty_link'](lang)),
				v.email(m['inputs.email.errors.invalid'](lang)),
			),
		}),
		v.object({
			method: v.literal('url' satisfies JobPostingApplicationMethod),
			link: v.pipe(
				v.string(),
				v.nonEmpty(m['inputs.job_posting.application.errors.nonempty_link'](lang)),
				v.url(m['inputs.url.errors.invalid'](lang)),
			),
		}),
	]);
}

export function createJobPostingUpsertSchema(lang: Language) {
	return v.objectAsync({
		id: v.optional(v.pipe(v.string(), v.startsWith('job_'))),
		title: v.pipe(v.string(), v.nonEmpty(m['inputs.job_posting.title.errors.nonempty'](lang))),
		type: v.picklist(JOB_POSTING_TYPES, m['inputs.job_posting.type.errors.nonempty'](lang)),
		location: v.pipe(
			v.string(),
			v.nonEmpty(m['inputs.job_posting.location.errors.nonempty'](lang)),
		),
		salary: v.pipe(v.string(), v.nonEmpty(m['inputs.job_posting.salary.errors.nonempty'](lang))),
		application: createJobPostingApplicationSchema(lang),
		expiredAt: v.pipe(
			v.date(m['inputs.job_posting.expired_at.errors.nonempty'](lang)),
			v.minValue(new Date(), m['inputs.job_posting.expired_at.errors.min'](lang)),
			v.maxValue(
				new Date(Date.now() + JOB_POSTING_MAX_EXPIRATION_MS),
				m['inputs.job_posting.expired_at.errors.max'](lang),
			),
		),
		description: v.pipe(
			v.string(),
			v.nonEmpty(m['inputs.job_posting.desc.errors.nonempty'](lang)),
			// this is an HTML field so max length should account for HTML tags
			v.maxLength(8000, m['inputs.job_posting.desc.errors.max'](lang, { length: '8000' })),
		),
	});
}

export type JobPostingUpsertInput = v.InferInput<ReturnType<typeof createJobPostingUpsertSchema>>;

export const JOB_POSTING_APPLICATION_METHOD_MESSAGES: Record<
	JobPostingApplicationMethod,
	{
		label: KeySimple;
		note: KeySimple;
		link: {
			label: KeySimple;
			iconClass: string;
			placeholder: KeySimple;
		};
	}
> = {
	email: {
		label: 'inputs.job_posting.application.options.email.label',
		note: 'inputs.job_posting.application.options.email.note',
		link: {
			label: 'inputs.email.label',
			iconClass: 'i-[ph--envelope-simple]',
			placeholder: 'inputs.job_posting.application.options.email.placeholder',
		},
	},
	url: {
		label: 'inputs.job_posting.application.options.url.label',
		note: 'inputs.job_posting.application.options.url.note',
		link: {
			label: 'inputs.url.label',
			iconClass: 'i-[ph--globe]',
			placeholder: 'inputs.job_posting.application.options.url.placeholder',
		},
	},
};
