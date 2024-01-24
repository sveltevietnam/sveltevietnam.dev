<script lang="ts" context="module">
	import { object as zObject, string as zString } from 'zod';
	export const mailSchema = zObject({
		name: zString().min(1),
		email: zString().email(),
		turnstile: zString().min(1),
	});
	export type MailSchema = typeof mailSchema;
</script>

<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	import { PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY } from '$env/static/public';
	import { getLangContext } from '$lib/contexts/lang';
	import { getSettingsContext } from '$lib/contexts/settings';
	import type { FormMessage } from '$lib/forms';
	import { getNotificationContext } from '$lib/notifications';
	import { turnstile } from '$lib/turnstile/turnstile.action';

	/** translations */
	export let action = '?/mail';
	export let superValidated: SuperValidated<MailSchema>;
	export let t = {
		name: 'Name',
		cta: 'Notify me',
	};
	let cls = '';
	export { cls as class };

	const { lang } = getLangContext();

	const noti = getNotificationContext();

	const { form, enhance, constraints, errors, delayed, message } = superForm<
		MailSchema,
		FormMessage
	>(superValidated, {
		taintedMessage: null,
		multipleSubmits: 'prevent',
		delayMs: 500,
		onError({ result }) {
			noti.helpers.error(result.error.message);
		},
	});

	$: if ($message) {
		switch ($message.type) {
			case 'error':
				noti.helpers.error($message.text);
				break;
			case 'success':
				noti.helpers.success($message.text);
				break;
			default:
				noti.helpers.info($message.text);
		}
	}

	const { colorScheme } = getSettingsContext();
	$: preferred = colorScheme.preferred;
</script>

<form class="space-y-6 {cls}" method="POST" use:enhance {action} autocomplete="on">
	<div class="space-y-3">
		<div class="relative">
			{#if $errors.name?.length}
				<p class="error">
					{$errors.name[0]}
				</p>
			{/if}
			<input
				class="c-input"
				type="text"
				name="name"
				placeholder={t.name}
				autocomplete="name"
				bind:value={$form.name}
				{...$constraints.name}
			/>
		</div>
		<div class="relative">
			{#if $errors.email?.length}
				<p class="error">
					{$errors.name?.[0]}
				</p>
			{/if}
			<input
				class="c-input"
				type="email"
				name="email"
				placeholder="Email"
				autocomplete="email"
				bind:value={$form.email}
				{...$constraints.email}
			/>
		</div>
		<div
			class="turnstile"
			turnstile-sitekey={PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
			turnstile-theme={$preferred}
			turnstile-response-field-name="turnstile"
			turnstile-response-field
			turnstile-size="normal"
			turnstile-language={$lang}
			use:turnstile
			on:turnstile={(e) => ($form.turnstile = e.detail)}
		/>
	</div>

	<div class="relative space-y-12">
		{#if $errors.turnstile?.length}
			<p class="error">{$errors.turnstile[0]}</p>
		{/if}
		<button type="submit" class="c-btn w-full" data-loading={$delayed}>
			{t.cta}
		</button>
	</div>
</form>

<style lang="postcss">
	.error {
		position: absolute;
		bottom: 100%;
		left: 0;

		padding-bottom: theme('spacing[0.5]');

		font-size: theme('fontSize.2xs');
		font-style: italic;
		color: theme('colors.error.surface.200');
	}

	.turnstile {
		overflow: hidden;

		&:global(:not([turnstile-rendered])) {
			&[turnstile-size='compact'] {
				width: 130px;
				height: 120px;
			}

			&:not([turnstile-size='compact']) {
				width: 300px;
				height: 65px;
			}
		}
	}

	.turnstile :global(iframe) {
		width: 100% !important;
		max-width: 100%;
	}
</style>
