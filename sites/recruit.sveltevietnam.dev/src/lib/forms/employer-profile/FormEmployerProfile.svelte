<script lang="ts" module>
	import { T } from '@sveltevietnam/i18n';
	import { RoutingContext } from '@sveltevietnam/kit/contexts';
	import type { Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import { superForm, fileProxy, type SuperValidated } from 'sveltekit-superforms';

	import * as m from '$data/locales/generated/messages';

	import type { EmployerProfileInput } from './schema';

	export interface EmployerProfileFormProps<WithEmail extends boolean> extends HTMLFormAttributes {
		withEmail?: WithEmail;
		data: SuperValidated<EmployerProfileInput<WithEmail>>;
		cta: Snippet<[{ delayed: boolean; timeout: boolean }]>;
		action: string;
	}
</script>

<script lang="ts" generics="WithEmail extends boolean = true">
	let { withEmail, data, cta, class: cls, ...rest }: EmployerProfileFormProps<WithEmail> = $props();

	const routing = RoutingContext.get();

	const { form, enhance, constraints, errors, delayed, timeout } = superForm<
		EmployerProfileInput<true>
	>(data as SuperValidated<EmployerProfileInput<true>>, {
		resetForm: false,
		invalidateAll: false,
		multipleSubmits: 'prevent',
		delayMs: 500,
		timeoutMs: 2000,
	});
	const avatarFile = fileProxy(form, 'avatar');

	let avatarPreviewUri = $derived($form.avatar ? URL.createObjectURL($form.avatar) : '');
</script>

<form class={['space-y-10', cls]} method="POST" enctype="multipart/form-data" use:enhance {...rest}>
	<div class="space-y-4">
		<!-- email -->
		{#if withEmail}
			<div class="space-y-1">
				<label class="block" for="email">
					<T message={m['inputs.employer.email.label']} />:
				</label>
				<input
					class="c-text-input w-full"
					type="email"
					name="email"
					id="email"
					placeholder={m['inputs.employer.email.placeholder'](routing.lang).toString()}
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
						<T message={m['inputs.employer.email.note']} />
					</p>
				</div>
			</div>
		{/if}

		<div class="tablet:items-baseline max-tablet:flex-col flex gap-x-10 gap-y-4">
			<div class="flex-1 space-y-4">
				<!-- name -->
				<div class="space-y-1">
					<label class="block" for="name">
						<T message={m['inputs.employer.name.label']} />:
					</label>
					<input
						class="c-text-input w-full"
						type="name"
						name="name"
						id="name"
						placeholder={m['inputs.employer.name.placeholder'](routing.lang).toString()}
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
						<T message={m['inputs.employer.website.label']} />:
					</label>
					<input
						class="c-text-input w-full"
						type="website"
						name="website"
						id="website"
						placeholder={m['inputs.employer.website.placeholder'](routing.lang).toString()}
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
					<span><T message={m['inputs.employer.avatar.label']} />:</span>
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
							<T message={m['inputs.employer.avatar.desc']} />
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
				<p class="c-text-body-sm text-red-500" id="error-agreed">{$errors.agreed[0]}</p>
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
					<T message={m['inputs.employer.agreement.desc']} />
				</label>
			</div>
		</div>
	</div>
	<div class="flex justify-end">
		{@render cta({ delayed: $delayed, timeout: $timeout })}
	</div>
</form>
