<script lang="ts" module>
	import { T } from '@sveltevietnam/i18n';
	import type { Message } from '@sveltevietnam/i18n/runtime';
	import { RoutingContext } from '@sveltevietnam/kit/contexts';
	import type { Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import { superForm, type SuperValidated, dateProxy } from 'sveltekit-superforms';

	import * as m from '$data/locales/generated/messages';

	import {
		JOB_POSTING_APPLICATION_METHODS,
		type JobPostingUpsertInput,
		type JobPostingType,
		type JobPostingApplicationMethod,
		JOB_POSTING_TYPES,
	} from './schema';

	export interface FormJobPostingUpsertProps extends HTMLFormAttributes {
		data: SuperValidated<JobPostingUpsertInput>;
		cta: Snippet<[{ delayed: boolean; timeout: boolean }]>;
		action: string;
	}
</script>

<script lang="ts">
	let { data, cta, class: cls, ...rest }: FormJobPostingUpsertProps = $props();

	const APPLICATION_METHOD_CONFIG: Record<
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

	const TYPE_MESSAGE: Record<JobPostingType, Message<'string', never>> = {
		'full-time': m['inputs.job_posting.type.options.full_time'],
		'part-time': m['inputs.job_posting.type.options.part_time'],
		internship: m['inputs.job_posting.type.options.internship'],
		contract: m['inputs.job_posting.type.options.contract'],
		volunteer: m['inputs.job_posting.type.options.volunteer'],
	};

	const routing = RoutingContext.get();

	const { form, enhance, constraints, errors, delayed, timeout } = superForm<JobPostingUpsertInput>(
		data as SuperValidated<JobPostingUpsertInput>,
		{
			resetForm: false,
			invalidateAll: false,
			multipleSubmits: 'prevent',
			delayMs: 500,
			timeoutMs: 2000,
		},
	);
	const applicationConfig = $derived(APPLICATION_METHOD_CONFIG[$form.applicationMethod]);

	const cachedApplicationLink: Record<JobPostingApplicationMethod, string> = $state({
		email: '',
		url: '',
	});
	function getApplicationMethod() {
		return $form.applicationMethod;
	}
	function setApplicationMethod(newMethod: JobPostingApplicationMethod) {
		// cache current link
		cachedApplicationLink[$form.applicationMethod] = $form.applicationLink;
		// update to new method
		$form.applicationMethod = newMethod;
		// restore cached link
		$form.applicationLink = cachedApplicationLink[newMethod];
	}

	const proxyExpiredAt = dateProxy(form, 'expiredAt', { format: 'date' });

	const commonErrorClasses = 'text-right text-xs text-red-500';
</script>

<form class={['space-y-10', cls]} method="POST" use:enhance {...rest}>
	<div class="space-y-6">
		<!-- title -->
		<div class="space-y-1">
			<label class="block" for="title">
				<T message={m['inputs.job_posting.title.label']} />:
			</label>
			<input
				class="c-text-input w-full"
				type="title"
				name="title"
				id="title"
				placeholder={m['inputs.job_posting.title.placeholder'](routing.lang).toString()}
				bind:value={$form.title}
				{...$constraints.title}
				{...$errors.title && {
					'aria-invalid': 'true',
					'aria-errormessage': 'error-title',
				}}
			/>
			{#if $errors.title?.[0]}
				<p class={commonErrorClasses} id="error-title">
					{$errors.title[0]}
				</p>
			{/if}
		</div>

		<!-- type -->
		<div class="space-y-1">
			<label class="block" for="type">
				<T message={m['inputs.job_posting.type.label']} />:
			</label>
			<select
				class="c-select w-full"
				name="type"
				id="type"
				bind:value={$form.type}
				{...$constraints.type}
				{...$errors.type && {
					'aria-invalid': 'true',
					'aria-errormessage': 'error-type',
				}}
			>
				{#each JOB_POSTING_TYPES as type (type)}
					<option value={type}>
						<T message={TYPE_MESSAGE[type]} />
					</option>
				{/each}
			</select>
			{#if $errors.type?.[0]}
				<p class={commonErrorClasses} id="error-type">
					{$errors.type[0]}
				</p>
			{/if}
		</div>

		<!-- location -->
		<div class="space-y-1">
			<label class="block" for="title">
				<T message={m['inputs.job_posting.location.label']} />:
			</label>
			<input
				class="c-text-input w-full"
				type="location"
				name="location"
				id="location"
				placeholder={m['inputs.job_posting.location.placeholder'](routing.lang).toString()}
				bind:value={$form.location}
				{...$constraints.location}
				{...$errors.location && {
					'aria-invalid': 'true',
					'aria-errormessage': 'error-location',
				}}
			/>
			{#if $errors.location?.[0]}
				<p class={commonErrorClasses} id="error-location">
					{$errors.location[0]}
				</p>
			{/if}
		</div>

		<!-- salary -->
		<div class="space-y-1">
			<label class="block" for="title">
				<T message={m['inputs.job_posting.salary.label']} />:
			</label>
			<input
				class="c-text-input w-full"
				type="salary"
				name="salary"
				id="salary"
				placeholder={m['inputs.job_posting.salary.placeholder'](routing.lang).toString()}
				bind:value={$form.salary}
				{...$constraints.salary}
				{...$errors.salary && {
					'aria-invalid': 'true',
					'aria-errormessage': 'error-salary',
				}}
			/>
			{#if $errors.salary?.[0]}
				<p class={commonErrorClasses} id="error-salary">
					{$errors.salary[0]}
				</p>
			{/if}
		</div>

		<!-- application method -->
		<div>
			<div class="space-y-1">
				<label class="block" for="title">
					<T message={m['inputs.job_posting.application.label']} />:
				</label>
				<select
					class="c-select w-full"
					name="applicationMethod"
					id="application-method"
					bind:value={getApplicationMethod, setApplicationMethod}
					{...$constraints.applicationMethod}
					{...$errors.applicationMethod && {
						'aria-invalid': 'true',
						'aria-errormessage': 'error-application-method',
					}}
				>
					{#each JOB_POSTING_APPLICATION_METHODS as method (method)}
						<option value={method}>
							<T message={APPLICATION_METHOD_CONFIG[method].label} />
						</option>
					{/each}
				</select>
				<div class="flex items-baseline justify-between gap-4">
					{#if $errors.applicationMethod?.[0]}
						<p class="text-xs text-red-500" id="error-application-method">
							{$errors.applicationMethod[0]}
						</p>
					{/if}
					<p class="c-text-body-xs ml-auto">
						<T message={applicationConfig.note} />
					</p>
				</div>
			</div>
			<div class="relative pl-6 pt-2">
				<div class="absolute bottom-1/2 left-2 h-12 w-4 border-b border-l border-current"></div>
				<label class="c-text-input">
					<span class="flex items-center gap-2">
						<i class={['i h-6 w-6', applicationConfig.link.iconClass]}></i>
						<T message={applicationConfig.link.label} />
					</span>
					<input
						type={$form.applicationMethod}
						name="applicationLink"
						placeholder={applicationConfig.link.placeholder(routing.lang).toString()}
						bind:value={$form.applicationLink}
						{...$constraints.applicationLink}
						{...$errors.applicationLink && {
							'aria-invalid': 'true',
							'aria-errormessage': 'error-application-link',
						}}
					/>
				</label>
				{#if $errors.applicationLink?.[0]}
					<p class="text-xs text-red-500" id="error-application-link">
						{$errors.applicationLink[0]}
					</p>
				{/if}
			</div>
		</div>

		<!-- expired-at -->
		<div class="space-y-1">
			<label class="block" for="title">
				<T message={m['inputs.job_posting.expired_at.label']} />:
			</label>
			<input
				class="c-text-input w-full"
				type="date"
				name="expiredAt"
				id="expires-at"
				bind:value={$proxyExpiredAt}
				{...$constraints.expiredAt}
				{...$errors.expiredAt && {
					'aria-invalid': 'true',
					'aria-errormessage': 'error-expires-at',
				}}
			/>
			{#if $errors.expiredAt?.[0]}
				<p class={commonErrorClasses} id="error-expires-at">
					{$errors.expiredAt[0]}
				</p>
			{/if}
		</div>

		<!-- description -->
		<div class="space-y-1">
			<label class="block" for="desc">
				<T message={m['inputs.job_posting.desc.label']} />:
			</label>
			<textarea
				class="c-text-input w-full"
				name="desc"
				id="desc"
				placeholder={m['inputs.job_posting.desc.placeholder'](routing.lang).toString()}
				rows="15"
				bind:value={$form.desc}
				{...$constraints.desc}
				{...$errors.desc && {
					'aria-invalid': 'true',
					'aria-errormessage': 'error-desc',
				}}
			></textarea>
			{#if $errors.desc?.[0]}
				<p class={commonErrorClasses} id="error-desc">
					{$errors.desc[0]}
				</p>
			{/if}
		</div>
	</div>

	{@render cta({ delayed: $delayed, timeout: $timeout })}
</form>
