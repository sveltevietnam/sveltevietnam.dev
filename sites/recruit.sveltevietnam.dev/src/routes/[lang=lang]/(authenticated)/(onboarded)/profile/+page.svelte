<script lang="ts">
	import { T } from '@sveltevietnam/i18n-new';
	import { Contexts } from '@sveltevietnam/kit/contexts';
	import { superForm } from 'sveltekit-superforms';

	import { SingleBoxPageLayout } from '$lib/components/single-box-page-layout';
	import { FormEmployerProfile } from '$lib/forms/employer-profile';
	import { createSuperFormGenericErrorHandler } from '$lib/forms/utils';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const {
		notifications: { toaster },
		i18n: { t },
	} = Contexts.get();

	const { form, enhance, constraints, errors, delayed, timeout, message } = superForm<
		{
			email: string;
		},
		'error' | 'pending' | 'unverified'
	>(data.updateEmailForm, {
		resetForm: false,
		invalidateAll: false,
		multipleSubmits: 'prevent',
		delayMs: 500,
		timeoutMs: 2000,
		onError: createSuperFormGenericErrorHandler(toaster),
	});

	function handleProfileUpdateSuccess() {
		toaster.success({ message: t({ key: 'pages.profile.update_info.success' }) });
	}
</script>

<SingleBoxPageLayout class="max-w-readable-relaxed space-y-10">
	<h1 class="sr-only">
		<T key="pages.profile.heading" />
	</h1>

	<section class="space-y-6" aria-labelledby="update-email">
		<h2 class="c-text-heading border-outline border-b" id="update-email">
			<T key="pages.profile.update_email.heading" />
		</h2>

		{#if !$message || $message === 'error'}
			<form method="POST" action="?/update-email" use:enhance>
				<!-- combined email input & submit button -->
				<div class="space-y-1">
					<p>
						<T key="inputs.employer.email.label" />:
					</p>
					<div class="flex items-stretch">
						<label class="c-text-input flex-1">
							<span class="min-w-12">Email:</span>
							<input
								type="email"
								name="email"
								placeholder="email@example.com"
								bind:value={$form.email}
								{...$constraints.email}
								{...$errors.email && {
									'aria-invalid': 'true',
									'aria-errormessage': 'error-email',
								}}
							/>
						</label>
						<button
							class="c-btn px-4"
							type="submit"
							data-delayed={$delayed}
							data-timeout={$timeout}
							data-umami-event="submit-change-email"
						>
							<i class="i i-[ph--floppy-disk] h-6 w-6"></i>
							<T key="save" />
						</button>
					</div>
					<div class="c-text-body-sm flex items-baseline justify-between gap-4">
						{#if $errors.email?.[0]}
							<p class="text-red-500" id="error-email">{$errors.email[0]}</p>
						{/if}
						<p class="ml-auto">
							<T key="pages.profile.update_email.form.email.note" />
						</p>
					</div>
				</div>
			</form>
		{/if}

		{#if $message}
			{#if $message === 'pending'}
				<p class="c-callout c-callout--info" role="alert">
					<T key="pages.profile.update_email.callout.pending" />
				</p>
			{:else if $message === 'unverified'}
				<p class="c-callout c-callout--warning" role="alert">
					<T key="pages.profile.update_email.callout.unverified" />
				</p>
			{:else}
				<p class="c-callout c-callout--error" role="alert">
					<T key="errors.generic" />
				</p>
			{/if}
		{/if}
	</section>

	<section class="space-y-6" aria-labelledby="update-info">
		<h2 class="c-text-heading border-outline border-b" id="update-info">
			<T key="pages.profile.update_info.heading" />
		</h2>

		<FormEmployerProfile
			data={data.updateInfoForm}
			action="?/update-info"
			withEmail={false}
			image={data.image}
			onSuccess={handleProfileUpdateSuccess}
		>
			{#snippet cta({ delayed, timeout })}
				<button
					class="c-btn px-4"
					type="submit"
					data-delayed={delayed}
					data-timeout={timeout}
					data-umami-event="submit-update-profile"
				>
					<i class="i i-[ph--floppy-disk] h-6 w-6"></i>
					<T key="save" />
				</button>
			{/snippet}
		</FormEmployerProfile>
	</section>
</SingleBoxPageLayout>
