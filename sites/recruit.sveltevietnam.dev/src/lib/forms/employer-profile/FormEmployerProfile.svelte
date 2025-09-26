<script lang="ts" module>
	import { T } from '@sveltevietnam/i18n/runtime';
	import { Contexts } from '@sveltevietnam/kit/contexts';
	import type { Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import { superForm, fileProxy, type SuperValidated } from 'sveltekit-superforms';

	import * as m from '$data/locales/generated/messages';

	import { createSuperFormGenericErrorHandler } from '../utils';

	import type { EmployerProfileInput } from './schema';

	export interface FormEmployerProfileProps<WithEmail extends boolean> extends HTMLFormAttributes {
		image?: string | null;
		withEmail?: WithEmail;
		data: SuperValidated<EmployerProfileInput<WithEmail>>;
		cta: Snippet<[{ delayed: boolean; timeout: boolean }]>;
		action: string;
		onSuccess?: () => void;
	}
</script>

<script lang="ts" generics="WithEmail extends boolean = true">
	let {
		image,
		onSuccess,
		withEmail,
		data,
		cta,
		class: cls,
		...rest
	}: FormEmployerProfileProps<WithEmail> = $props();

	const {
		routing,
		notifications: { toaster },
	} = Contexts.get();

	const { form, enhance, constraints, errors, delayed, timeout } = superForm<
		EmployerProfileInput<true>
	>(data as SuperValidated<EmployerProfileInput<true>>, {
		resetForm: false,
		invalidateAll: false,
		multipleSubmits: 'prevent',
		delayMs: 500,
		timeoutMs: 2000,
		onError: createSuperFormGenericErrorHandler(toaster),
		onUpdated({ form }) {
			if (form.valid) onSuccess?.();
		},
	});
	const imageFile = fileProxy(form, 'image');

	let imagePreviewUri = $derived(
		$form.image && (!$errors.image || !$errors.image.length)
			? URL.createObjectURL($form.image)
			: image,
	);
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
						type="url"
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

			<!-- image -->
			<div class="w-32 space-y-1">
				<label class="flex cursor-pointer flex-col gap-1" data-testid="image">
					<span><T message={m['inputs.employer.image.label']} />:</span>
					<span
						class={[
							'border-onehalf c-text-body-xs grid aspect-square h-auto w-full place-items-center border-current text-center',
							!imagePreviewUri && 'p-2',
						]}
					>
						{#if imagePreviewUri}
							<img
								data-testid="image-preview"
								class="h-full w-full object-cover"
								width="200"
								height="200"
								alt=""
								src={imagePreviewUri}
							/>
						{:else}
							<T message={m['inputs.employer.image.desc']} />
						{/if}
					</span>
					<input
						class="sr-only"
						type="file"
						name="image"
						id="image"
						accept="image/*"
						bind:files={$imageFile}
						{...$constraints.image}
						{...$errors.image && {
							'aria-invalid': 'true',
							'aria-errormessage': 'error-image',
						}}
					/>
				</label>
				{#if $errors.image?.[0]}
					<p class="text-xs text-red-500" id="error-image">{$errors.image[0]}</p>
				{/if}
			</div>
		</div>

		<!-- description -->
		<div class="space-y-1">
			<label class="block" for="description">
				<T message={m['inputs.employer.desc.label']} />:
			</label>
			<textarea
				class="c-text-input w-full"
				name="description"
				id="description"
				placeholder={m['inputs.employer.desc.placeholder'](routing.lang).toString()}
				rows="4"
				bind:value={$form.description}
				{...$constraints.description}
				{...$errors.description && {
					'aria-invalid': 'true',
					'aria-errormessage': 'error-description',
				}}
			></textarea>
			<div class="flex items-baseline justify-between gap-4">
				{#if $errors.description?.[0]}
					<p class="text-xs text-red-500" id="error-description">{$errors.description[0]}</p>
				{/if}
				<p class="c-text-body-xs ml-auto text-right">
					<T message={m['inputs.employer.desc.note']} />
				</p>
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
