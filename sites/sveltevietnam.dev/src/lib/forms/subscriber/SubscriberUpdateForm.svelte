<script lang="ts" module>
	import { turnstile } from '@svelte-put/cloudflare-turnstile';
	import { SUBSCRIPTION_CHANNELS } from '@sveltevietnam/backend/data/subscribers/channels';
	import { LANGUAGES } from '@sveltevietnam/i18n';
	import { T } from '@sveltevietnam/i18n';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';

	import * as m from '$data/locales/generated/messages';
	import { VITE_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY } from '$env/static/public';
	import { NotificationContext } from '$lib/notifications/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	import { type SubscriberUpdateInput } from './schema';

	export interface SubscriberUpdateFormProps extends HTMLFormAttributes {
		data: SuperValidated<SubscriberUpdateInput>;
	}
</script>

<script lang="ts">
	let { class: cls, data, action = '?/update', ...rest }: SubscriberUpdateFormProps = $props();

	const noti = NotificationContext.get();
	const settings = SettingsContext.get();

	const { form, enhance, constraints, errors, delayed, timeout } = superForm<
		SubscriberUpdateInput,
		string
	>(data, {
		resetForm: false,
		multipleSubmits: 'prevent',
		delayMs: 500,
		timeoutMs: 2000,
		onResult({ result }) {
			if (result.type === 'success') {
				noti.toaster.success({
					message: m['forms.subscriber.update.success'],
				});
			} else if (result.type === 'error') {
				const error = result.error as App.Error;
				noti.toaster.error({
					title: `${error.code} - ${error.message}`,
					message: m['forms.subscriber.update.errors.unknown'],
				});
			}
		},
	});

	const channelMessages = {
		job: m['forms.subscriber.update.inputs.channels.job'],
		blog: m['forms.subscriber.update.inputs.channels.blog'],
		event: m['forms.subscriber.update.inputs.channels.event'],
	};
	const languageMessages = {
		vi: m['languages.vietnamese'],
		en: m['languages.english'],
	};
	const commonFieldsetClasses = 'border-onehalf space-y-4 pb-4 px-2 tablet:px-4 pt-0';
</script>

<form class={['space-y-6', cls]} use:enhance method="POST" {action} {...rest}>
	<div class="space-y-4">
		<input type="text" name="id" value={$form.id} hidden />

		<!-- personal information -->
		<fieldset class={commonFieldsetClasses}>
			<legend>
				<T message={m['forms.subscriber.update.inputs.personal.heading']} />
			</legend>

			<!-- name -->
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

			<!-- email -->
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
		</fieldset>

		<!-- languages -->
		<fieldset class={commonFieldsetClasses}>
			<legend>
				<T message={m['forms.subscriber.update.inputs.language.heading']} />
			</legend>
			<p><T message={m['forms.subscriber.update.inputs.language.desc']} />:</p>
			<ul class="flex items-center gap-10 pl-2">
				{#each LANGUAGES as lang (lang)}
					<li>
						<label class="flex cursor-pointer items-center gap-2">
							<input
								class="c-radio"
								type="radio"
								name="language"
								value={lang}
								bind:group={$form.language}
							/>
							<span>
								<T message={languageMessages[lang]} />
							</span>
						</label>
					</li>
				{/each}
			</ul>
		</fieldset>

		<!-- notification channels -->
		<fieldset class={commonFieldsetClasses}>
			<legend>
				<T message={m['forms.subscriber.update.inputs.channels.heading']} />
			</legend>
			<p><T message={m['forms.subscriber.update.inputs.channels.desc']} />:</p>
			<ul class="space-y-2 pl-2">
				{#each SUBSCRIPTION_CHANNELS as channel (channel)}
					<li>
						<label class="flex cursor-pointer items-center gap-3">
							<input
								class="c-checkbox"
								type="checkbox"
								name="channels"
								value={channel}
								bind:group={$form.channels}
								multiple
							/>
							<span>
								<T message={channelMessages[channel]} />
							</span>
						</label>
					</li>
				{/each}
			</ul>
		</fieldset>

		<!-- cloudflare turnstile -->
		<div class="space-y-1">
			<div class="c-text-body-sm flex items-baseline justify-between gap-6">
				<p><T message={m['inputs.turnstile.desc']} />:</p>
				{#if $errors.turnstile?.[0]}
					<p class="max-w-readable-tight text-right text-red-500">
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
	</div>
	<button
		class="c-btn c-btn--pop px-4"
		type="submit"
		data-delayed={$delayed}
		data-timeout={$timeout}
	>
		<span><T message={m.update} /></span>
	</button>
</form>
