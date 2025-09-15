import {
	JOB_POSTING_TYPES,
	JOB_POSTING_APPLICATION_METHODS,
	type JobPostingType,
	type JobPostingApplicationMethod,
} from '@sveltevietnam/backend/data/job-postings/enums';
import type { Language } from '@sveltevietnam/i18n';
import type { Message } from '@sveltevietnam/i18n/runtime';
import * as v from 'valibot';

import * as m from '$data/locales/generated/messages';

export {
	type JobPostingType,
	type JobPostingApplicationMethod,
	JOB_POSTING_TYPES,
	JOB_POSTING_APPLICATION_METHODS,
};

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
		expiredAt: v.date(m['inputs.job_posting.expired_at.errors.nonempty'](lang)),
		description: v.pipe(v.string(), v.nonEmpty(m['inputs.job_posting.desc.errors.nonempty'](lang))),
	});
}

export type JobPostingUpsertInput = v.InferInput<ReturnType<typeof createJobPostingUpsertSchema>>;

export const JOB_POSTING_TYPE_LABEL: Record<JobPostingType, Message<'string', never>> = {
	'full-time': m['inputs.job_posting.type.options.full_time'],
	'part-time': m['inputs.job_posting.type.options.part_time'],
	internship: m['inputs.job_posting.type.options.internship'],
	contract: m['inputs.job_posting.type.options.contract'],
	volunteer: m['inputs.job_posting.type.options.volunteer'],
};

export const JOB_POSTING_APPLICATION_METHOD_MESSAGES: Record<
	JobPostingApplicationMethod,
	{
		label: Message<'string', never>;
		note: Message<'string', never>;
		link: {
			label: Message<'string', never>;
			iconClass: string;
			placeholder: Message<'string', never>;
		};
	}
> = {
	email: {
		label: m['inputs.job_posting.application.options.email.label'],
		note: m['inputs.job_posting.application.options.email.note'],
		link: {
			label: m['inputs.email.label'],
			iconClass: 'i-[ph--envelope-simple]',
			placeholder: m['inputs.job_posting.application.options.email.placeholder'],
		},
	},
	url: {
		label: m['inputs.job_posting.application.options.url.label'],
		note: m['inputs.job_posting.application.options.url.note'],
		link: {
			label: m['inputs.url.label'],
			iconClass: 'i-[ph--globe]',
			placeholder: m['inputs.job_posting.application.options.url.placeholder'],
		},
	},
};
