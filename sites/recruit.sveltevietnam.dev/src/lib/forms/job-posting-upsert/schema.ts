import type { Language } from '@sveltevietnam/i18n';
import * as v from 'valibot';

import * as m from '$data/locales/generated/messages';

export const JOB_POSTING_TYPES = [
	'full-time',
	'part-time',
	'internship',
	'contract',
	'volunteer',
] as const;
export type JobPostingType = (typeof JOB_POSTING_TYPES)[number];

export const JOB_POSTING_APPLICATION_METHODS = ['email', 'url'] as const;
export type JobPostingApplicationMethod = (typeof JOB_POSTING_APPLICATION_METHODS)[number];

export function createJobPostingUpsertSchema(lang: Language) {
	return v.object({
		title: v.pipe(v.string(), v.nonEmpty(m['inputs.job_posting.title.errors.nonempty'](lang))),
		type: v.picklist(JOB_POSTING_TYPES, m['inputs.job_posting.type.errors.nonempty'](lang)),
		location: v.pipe(
			v.string(),
			v.nonEmpty(m['inputs.job_posting.location.errors.nonempty'](lang)),
		),
		salary: v.pipe(v.string(), v.nonEmpty(m['inputs.job_posting.salary.errors.nonempty'](lang))),
		applicationMethod: v.picklist(
			JOB_POSTING_APPLICATION_METHODS,
			m['inputs.job_posting.application.errors.nonempty_method'](lang),
		),
		applicationLink: v.pipe(
			v.string(),
			v.nonEmpty(m['inputs.job_posting.application.errors.nonempty_link'](lang)),
		),
		expiredAt: v.pipe(
			v.string(),
			v.isoDate(m['inputs.job_posting.expired_at.errors.nonempty'](lang)),
		),
		desc: v.pipe(v.string(), v.nonEmpty(m['inputs.job_posting.desc.errors.nonempty'](lang))),
	});
}

export type JobPostingUpsertInput = v.InferInput<ReturnType<typeof createJobPostingUpsertSchema>>;
