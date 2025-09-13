<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { Contexts } from '@sveltevietnam/kit/contexts';
	import { superForm } from 'sveltekit-superforms';

	import * as m from '$data/locales/generated/messages';
	import { SingleBoxPageLayout } from '$lib/components/single-box-page-layout';
	import { FormEmployerProfile } from '$lib/forms/employer-profile';
	import { createSuperFormGenericErrorHandler } from '$lib/forms/utils';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const {
		notifications: { toaster },
	} = Contexts.get();

	const { form, enhance, constraints, errors, delayed, timeout } = superForm(data.updateEmailForm, {
		resetForm: false,
		invalidateAll: false,
		multipleSubmits: 'prevent',
		delayMs: 500,
		timeoutMs: 2000,
		onError: createSuperFormGenericErrorHandler(toaster),
		onUpdated({ form }) {
			if (form.valid) {
				// TODO: ...
			}
		},
	});

	function handleProfileUpdateSuccess() {
		toaster.success({ message: m['pages.profile.update_info.success'] });
	}
</script>

<SingleBoxPageLayout class="max-w-readable space-y-10">
	<h1 class="sr-only">
		<T message={m['pages.profile.heading']} />
	</h1>

	<section class="space-y-6">
		<h2 class="c-text-heading border-outline border-b">
			<T message={m['pages.profile.update_email.heading']} />
		</h2>

		<form method="POST" action="?/update-email" use:enhance>
			<!-- combined email input & submit button -->
			<div class="space-y-1">
				<p>
					<T message={m['inputs.employer.email.label']} />:
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
					<button class="c-btn px-4" type="submit" data-delayed={$delayed} data-timeout={$timeout}>
						<i class="i i-[ph--floppy-disk] h-6 w-6"></i>
						<T message={m.save} />
					</button>
				</div>
				<div class="c-text-body-sm flex items-baseline justify-between gap-4">
					{#if $errors.email?.[0]}
						<p class="text-red-500" id="error-email">{$errors.email[0]}</p>
					{/if}
					<p class="ml-auto">
						<T message={m['pages.profile.update_email.form.email.note']} />
					</p>
				</div>
			</div>
		</form>

		<p class="c-callout c-callout--info">
			<T message={m['pages.profile.update_email.callout']} />
		</p>
	</section>

	<section class="space-y-6">
		<h2 class="c-text-heading border-outline border-b">
			<T message={m['pages.profile.update_info.heading']} />
		</h2>

		<FormEmployerProfile
			data={data.updateInfoForm}
			action="?/update-info"
			withEmail={false}
			image={data.image}
			onSuccess={handleProfileUpdateSuccess}
		>
			{#snippet cta({ delayed, timeout })}
				<button class="c-btn px-4" type="submit" data-delayed={delayed} data-timeout={timeout}>
					<i class="i i-[ph--floppy-disk] h-6 w-6"></i>
					<T message={m['save']} />
				</button>
			{/snippet}
		</FormEmployerProfile>
	</section>
</SingleBoxPageLayout>
