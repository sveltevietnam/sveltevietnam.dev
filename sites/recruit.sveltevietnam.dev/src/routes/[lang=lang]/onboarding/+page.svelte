<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { RoutingContext } from '@sveltevietnam/kit/contexts';
	import { superForm, fileProxy } from 'sveltekit-superforms';

	import * as m from '$data/locales/generated/messages';
	import { SingleBoxPageLayout } from '$lib/components/single-box-page-layout';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const routing = RoutingContext.get();

	const { form, enhance, constraints, errors, delayed, timeout } = superForm(data.form, {
		resetForm: false,
		invalidateAll: false,
		multipleSubmits: 'prevent',
		delayMs: 500,
		timeoutMs: 2000,
	});
	const avatarFile = fileProxy(form, 'avatar');

	let avatarPreviewUri = $derived($form.avatar ? URL.createObjectURL($form.avatar) : '');
</script>

<SingleBoxPageLayout class="max-w-readable space-y-6">
	<h1 class="c-text-heading-md">
		<T message={m['pages.onboarding.heading']} />
	</h1>
	<p class="leading-relaxed">
		<T message={m['pages.onboarding.desc']} />
	</p>
	<form
		class="space-y-10"
		method="POST"
		action="?/onboard"
		enctype="multipart/form-data"
		use:enhance
	>
		<div class="space-y-4">
			<!-- email -->
			<div class="space-y-1">
				<label class="block" for="email">
					<T message={m['pages.onboarding.form.email.label']} />:
				</label>
				<input
					class="c-text-input w-full"
					type="email"
					name="email"
					id="email"
					placeholder={m['pages.onboarding.form.email.placeholder'](routing.lang).toString()}
					bind:value={$form.email}
					{...$constraints.email}
					{...$errors.email && {
						'aria-invalid': 'true',
						'aria-errormessage': 'error-email',
					}}
				/>
				<div class="flex items-baseline justify-between gap-4">
					{#if $errors.email?.[0]}
						<p class="text-xs text-red-500" id="error-email">{$errors.email[0]}</p>
					{/if}
					<p class="c-text-body-xs ml-auto">
						<T message={m['pages.onboarding.form.email.note']} />
					</p>
				</div>
			</div>

			<div class="tablet:items-baseline max-tablet:flex-col flex gap-x-10 gap-y-4">
				<div class="flex-1 space-y-4">
					<!-- name -->
					<div class="space-y-1">
						<label class="block" for="name">
							<T message={m['pages.onboarding.form.name.label']} />:
						</label>
						<input
							class="c-text-input w-full"
							type="name"
							name="name"
							id="name"
							placeholder={m['pages.onboarding.form.name.placeholder'](routing.lang).toString()}
							bind:value={$form.name}
							{...$constraints.name}
							{...$errors.name && {
								'aria-invalid': 'true',
								'aria-errormessage': 'error-name',
							}}
						/>
						{#if $errors.name?.[0]}
							<p class="text-right text-xs text-red-500" id="error-name">{$errors.name[0]}</p>
						{/if}
					</div>

					<!-- website -->
					<div class="space-y-1">
						<label class="block" for="website">
							<T message={m['pages.onboarding.form.website.label']} />:
						</label>
						<input
							class="c-text-input w-full"
							type="website"
							name="website"
							id="website"
							placeholder={m['pages.onboarding.form.website.placeholder'](routing.lang).toString()}
							bind:value={$form.website}
							{...$constraints.website}
							{...$errors.website && {
								'aria-invalid': 'true',
								'aria-errormessage': 'error-website',
							}}
						/>
						{#if $errors.website?.[0]}
							<p class="text-right text-xs text-red-500" id="error-website">
								{$errors.website[0]}
							</p>
						{/if}
					</div>
				</div>

				<!-- avatar -->
				<div class="w-32 space-y-1">
					<label class="flex cursor-pointer flex-col gap-1">
						<span><T message={m['pages.onboarding.form.avatar.label']} />:</span>
						<span
							class={[
								'border-onehalf c-text-body-xs grid aspect-square h-auto w-full place-items-center border-current text-center',
								!$form.avatar && 'p-2',
							]}
						>
							{#if $form.avatar}
								<img
									class="h-full w-full object-cover"
									width="200"
									height="200"
									alt=""
									src={avatarPreviewUri}
								/>
							{:else}
								<T message={m['pages.onboarding.form.avatar.desc']} />
							{/if}
						</span>
						<input
							class="sr-only"
							type="file"
							name="avatar"
							id="avatar"
							accept="image/*"
							bind:files={$avatarFile}
							{...$constraints.avatar}
							{...$errors.avatar && {
								'aria-invalid': 'true',
								'aria-errormessage': 'error-avatar',
							}}
						/>
					</label>
					{#if $errors.avatar?.[0]}
						<p class="text-xs text-red-500" id="error-avatar">{$errors.avatar[0]}</p>
					{/if}
				</div>
			</div>

			<!-- terms agreement -->
			<div class="space-y-1 pt-2">
				{#if $errors.agreed?.[0]}
					<p class="text-sm text-red-500" id="error-agreed">{$errors.agreed[0]}</p>
				{/if}
				<div class="flex items-start gap-4">
					<input
						class="c-checkbox"
						type="checkbox"
						name="agreed"
						id="agreed"
						bind:checked={$form.agreed}
						{...$constraints.agreed}
						{...$errors.agreed && {
							'aria-invalid': 'true',
							'aria-errormessage': 'error-agreed',
						}}
					/>
					<label for="agreed">
						<T message={m['pages.onboarding.form.agreement.desc']} />
					</label>
				</div>
			</div>
		</div>
		<hr class="text-outline" />
		<div class="flex justify-end">
			<button
				class="c-btn c-btn--pop"
				type="submit"
				data-delayed={$delayed}
				data-timeout={$timeout}
			>
				<T message={m['pages.onboarding.form.submit']} />
			</button>
		</div>
	</form>
</SingleBoxPageLayout>
