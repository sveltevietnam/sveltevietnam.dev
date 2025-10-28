<script lang="ts" module>
	import { JOB_POSTING_TYPE_I18N } from '@sveltevietnam/backend/data/job-postings/enums';
	import { T } from '@sveltevietnam/i18n-new';
	import type { KeySimple } from '@sveltevietnam/i18n-new/generated';
	import { Contexts } from '@sveltevietnam/kit/contexts';
	import { formatDate } from '@sveltevietnam/kit/utilities/datetime';
	import type { Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import { superForm, type SuperValidated, dateProxy } from 'sveltekit-superforms';

	import { VITE_PUBLIC_MODE, VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN } from '$env/static/public';
	import { RichTextEditor } from '$lib/components/rich-text-editor';

	import { createSuperFormGenericErrorHandler } from '../utils';

	import {
		JOB_POSTING_APPLICATION_METHODS,
		JOB_POSTING_APPLICATION_METHOD_MESSAGES,
		type JobPostingUpsertInput,
		type JobPostingApplicationMethod,
		JOB_POSTING_TYPES,
		JOB_POSTING_MAX_EXPIRATION_MS,
	} from './schema';

	export interface FormJobPostingUpsertProps extends HTMLFormAttributes {
		data: SuperValidated<JobPostingUpsertInput>;
		cta: Snippet<[{ delayed: boolean; timeout: boolean }]>;
		action: string;
		successTKey: KeySimple;
	}
</script>

<script lang="ts">
	let { data, cta, class: cls, successTKey, ...rest }: FormJobPostingUpsertProps = $props();

	const {
		routing,
		notifications: { toaster },
		i18n: { t },
	} = Contexts.get();

	const descriptionCacheKey = 'job-desc-draft';

	const { form, enhance, constraints, errors, delayed, timeout } = superForm<JobPostingUpsertInput>(
		data as SuperValidated<JobPostingUpsertInput>,
		{
			dataType: 'json',
			resetForm: false,
			invalidateAll: false,
			multipleSubmits: 'prevent',
			delayMs: 500,
			timeoutMs: 2000,
			onError: createSuperFormGenericErrorHandler(toaster, routing.lang),
			onResult({ result }) {
				if (result.type === 'redirect') {
					localStorage.removeItem(descriptionCacheKey);
					toaster.success({ message: t({ key: successTKey }) });
				}
			},
		},
	);
	const applicationMessages = $derived(
		JOB_POSTING_APPLICATION_METHOD_MESSAGES[$form.application.method],
	);

	const cachedApplicationLink: Record<JobPostingApplicationMethod, string> = $state({
		email: '',
		url: '',
	});
	function getApplicationMethod() {
		return $form.application.method;
	}
	function setApplicationMethod(newMethod: JobPostingApplicationMethod) {
		// cache current link
		cachedApplicationLink[$form.application.method] = $form.application.link;
		// update to new method
		$form.application.method = newMethod;
		// restore cached link
		$form.application.link = cachedApplicationLink[newMethod];
	}

	const proxyExpiredAt = dateProxy(form, 'expiredAt', { format: 'date' });

	const commonErrorClasses = 'text-right text-xs text-red-500';
</script>

<form class={['space-y-10', cls]} method="POST" use:enhance {...rest}>
	{#if VITE_PUBLIC_MODE === 'test'}
		<input type="text" name="id" data-testid="id" bind:value={$form.id} {...$constraints.id} />
	{/if}
	<div class="space-y-6">
		<!-- title -->
		<div class="space-y-1">
			<label class="block" for="title">
				<T key="inputs.job_posting.title.label" />:
			</label>
			<input
				class="c-text-input w-full"
				type="title"
				name="title"
				id="title"
				placeholder={await t({ key: 'inputs.job_posting.title.placeholder' })}
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
				<T key="inputs.job_posting.type.label" />:
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
						{JOB_POSTING_TYPE_I18N[type][routing.lang]}
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
			<label class="block" for="location">
				<T key="inputs.job_posting.location.label" />:
			</label>
			<input
				class="c-text-input w-full"
				type="location"
				name="location"
				id="location"
				placeholder={await t({ key: 'inputs.job_posting.location.placeholder' })}
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
			<label class="block" for="salary">
				<T key="inputs.job_posting.salary.label" />:
			</label>
			<input
				class="c-text-input w-full"
				type="salary"
				name="salary"
				id="salary"
				placeholder={await t({ key: 'inputs.job_posting.salary.placeholder' })}
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

		<!-- application -->
		<fieldset>
			<div class="space-y-1">
				<label class="block" for="application-method">
					<T key="inputs.job_posting.application.label" />:
				</label>
				<select
					class="c-select w-full"
					name="applicationMethod"
					id="application-method"
					bind:value={getApplicationMethod, setApplicationMethod}
					{...$constraints.application?.method}
					{...$errors.application?.method && {
						'aria-invalid': 'true',
						'aria-errormessage': 'error-application-method',
					}}
				>
					{#each JOB_POSTING_APPLICATION_METHODS as method (method)}
						<option value={method}>
							<T key={JOB_POSTING_APPLICATION_METHOD_MESSAGES[method].label} />
						</option>
					{/each}
				</select>
				<div class="flex items-baseline justify-between gap-4">
					{#if $errors.application?.method?.[0]}
						<p class="text-xs text-red-500" id="error-application-method">
							{$errors.application.method[0]}
						</p>
					{/if}
					<p class="c-text-body-xs ml-auto">
						<T key={applicationMessages.note} />
					</p>
				</div>
			</div>
			<div class="relative pt-2 pl-6">
				<div class="absolute bottom-1/2 left-2 h-12 w-4 border-b border-l border-current"></div>
				<label class="c-text-input">
					<span class="flex items-center gap-2">
						<i class={['i h-6 w-6', applicationMessages.link.iconClass]}></i>
						<T key={applicationMessages.link.label} />
					</span>
					<input
						type={$form.application.method}
						name="applicationLink"
						placeholder={await t({ key: applicationMessages.link.placeholder })}
						bind:value={$form.application.link}
						{...$constraints.application?.link}
						{...$errors.application?.link && {
							'aria-invalid': 'true',
							'aria-errormessage': 'error-application-link',
						}}
					/>
				</label>
				{#if $errors.application?.link?.[0]}
					<p class="pt-1 text-right text-xs text-red-500" id="error-application-link">
						{$errors.application.link[0]}
					</p>
				{/if}
			</div>
		</fieldset>

		<!-- expired-at -->
		<div class="space-y-1">
			<label class="block" for="expires-at">
				<T key="inputs.job_posting.expired_at.label" />:
			</label>
			<input
				class="c-text-input w-full"
				type="date"
				name="expiredAt"
				id="expires-at"
				bind:value={$proxyExpiredAt}
				{...$constraints.expiredAt}
				min={formatDate(new Date(), '-')}
				max={formatDate(Date.now() + JOB_POSTING_MAX_EXPIRATION_MS, '-')}
				{...$errors.expiredAt && {
					'aria-invalid': 'true',
					'aria-errormessage': 'error-expires-at',
				}}
			/>
			<p class="c-text-body-xs ml-auto text-right">
				<T
					key="inputs.job_posting.expired_at.note"
					params={{ mainSiteUrl: VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN }}
				/>
			</p>
			{#if $errors.expiredAt?.[0]}
				<p class={commonErrorClasses} id="error-expires-at">
					{$errors.expiredAt[0]}
				</p>
			{/if}
		</div>

		<!-- description -->
		<div class="space-y-1">
			<p class="block" id="description-label">
				<T key="inputs.job_posting.desc.label" />:
			</p>
			<RichTextEditor
				aria-labelledby="description-label"
				headings={[3, 5]}
				cache={descriptionCacheKey}
				onchange={(value) => ($form.description = value)}
				html={data.data.description}
				placeholder="inputs.job_posting.desc.placeholder"
				maxLength={2500}
			/>
			<input
				type="text"
				name="description"
				bind:value={$form.description}
				{...$errors.description && {
					'aria-invalid': 'true',
					'aria-errormessage': 'error-description',
				}}
				hidden
			/>
			{#if $errors.description?.[0]}
				<p class={commonErrorClasses} id="error-description">
					{$errors.description[0]}
				</p>
			{/if}
		</div>
	</div>

	{@render cta({ delayed: $delayed, timeout: $timeout })}
</form>
