<script lang="ts" module>
	import { turnstile } from '@svelte-put/cloudflare-turnstile';
	import { SUBSCRIPTION_CHANNELS } from '@sveltevietnam/backend/data/subscribers/channels';
	import { T } from '@sveltevietnam/i18n';
	import { onMount } from 'svelte';
	import type { ChangeEventHandler, HTMLFormAttributes } from 'svelte/elements';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';

	import * as m from '$data/locales/generated/messages';
	import { VITE_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY } from '$env/static/public';
	import { NotificationContext } from '$lib/notifications/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	import { type SubscribeUpsertInput } from './schema';

	export interface SubscriberUpsertFormProps extends HTMLFormAttributes {
		data: SuperValidated<SubscribeUpsertInput>;
	}
</script>

<script lang="ts">
	let { class: cls, data, action = '?/subscribe', ...rest }: SubscriberUpsertFormProps = $props();

	const noti = NotificationContext.get();
	const settings = SettingsContext.get();

	const { form, enhance, constraints, errors, delayed, timeout } = superForm<
		SubscribeUpsertInput,
		string
	>(data, {
		resetForm: false,
		invalidateAll: false,
		multipleSubmits: 'prevent',
		delayMs: 500,
		timeoutMs: 2000,
		onResult({ result }) {
			if (result.type === 'success') {
				noti.toaster.success({
					message: m['forms.subscriber.upsert.success'],
				});
			} else if (result.type === 'error') {
				const error = result.error as App.Error;
				noti.toaster.error({
					title: `${error.code} - ${error.message}`,
					message: m['forms.subscriber.upsert.errors.unknown'],
				});
			}
		},
	});

	$effect(() => {
		$form.language = settings.language;
	});

	let all = $state(false);
	const handleCheckAll: ChangeEventHandler<HTMLInputElement> = function (e) {
		$form.channels = e.currentTarget.checked ? [...SUBSCRIPTION_CHANNELS] : data.data.channels;
	};
	onMount(() => {
		$form.channels = all ? [...SUBSCRIPTION_CHANNELS] : data.data.channels;
	});
</script>

<form class={['space-y-6', cls]} use:enhance method="POST" {action} {...rest}>
	<div class="space-y-4">
		<div class="space-y-1">
			{#if $errors.name?.[0]}
				<p class="text-sm text-red-500" id="error-name">{$errors.name[0]}</p>
			{/if}
			<label class="c-text-input">
				<span class="min-w-12"><T message={m['inputs.name.label']} />:</span>
				<input
					class=" w-full"
					type="text"
					name="name"
					placeholder="Văn Vũ / Phương Phạm / ..."
					bind:value={$form.name}
					{...$constraints.name}
					{...$errors.name && {
						'aria-invalid': 'true',
						'aria-errormessage': 'error-name',
					}}
				/>
			</label>
		</div>
		<div class="space-y-1">
			{#if $errors.email?.[0]}
				<p class="text-sm text-red-500" id="error-email">{$errors.email[0]}</p>
			{/if}
			<label class="c-text-input">
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
		</div>
		<div class="space-y-1">
			<div class="c-text-body-sm flex items-baseline justify-between gap-6">
				<p class=""><T message={m['inputs.turnstile.desc']} />:</p>
				{#if $errors.turnstile?.[0]}
					<p class="max-w-readable-tight text-right text-red-500 text-sm">
						{$errors.turnstile[0]}
					</p>
				{/if}
			</div>
			<div
				class="turnstile border-onehalf border-current"
				use:turnstile
				turnstile-sitekey={VITE_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
				turnstile-size="flexible"
				turnstile-response-field-name="turnstile"
				turnstile-response-field
				turnstile-language={settings.language}
			>
				<!-- injected by @svelte-put/cloudflare-turnstile -->
			</div>
		</div>
		<input
			type="text"
			name="language"
			bind:value={$form.language}
			hidden
			{...$constraints.language}
		/>
		<select hidden multiple name="channels" bind:value={$form.channels} {...$constraints.channels}>
			{#each SUBSCRIPTION_CHANNELS as channel (channel)}
				<option value={channel}>{channel}</option>
			{/each}
		</select>
		<label class="flex cursor-pointer items-center gap-3">
			<input class="c-checkbox" type="checkbox" onchange={handleCheckAll} bind:checked={all} />
			<span>
				<T message={m['forms.subscriber.upsert.all']} />
			</span>
		</label>
	</div>
	<button
		class="c-btn c-btn--pop px-4"
		type="submit"
		data-delayed={$delayed}
		data-timeout={$timeout}
	>
		<span><T message={m.subscribe} /></span>
	</button>
</form>
