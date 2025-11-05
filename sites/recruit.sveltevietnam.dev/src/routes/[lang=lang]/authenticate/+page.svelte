<script lang="ts">
	import { turnstile } from '@svelte-put/cloudflare-turnstile';
	import { T } from '@sveltevietnam/i18n';
	import { NotificationContext, RoutingContext } from '@sveltevietnam/kit/contexts';
	import { formatRelativeTime } from '@sveltevietnam/kit/utilities/datetime';
	import { superForm } from 'sveltekit-superforms';

	import {
		VITE_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY,
		VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN,
	} from '$env/static/public';
	import { Countdown } from '$lib/components/countdown';
	import { SingleBoxPageLayout } from '$lib/components/single-box-page-layout';
	import { createSuperFormGenericErrorHandler } from '$lib/forms/utils';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const { toaster } = NotificationContext.get();
	const routing = RoutingContext.get();

	const { form, enhance, constraints, errors, delayed, timeout, message } = superForm<
		{
			email: string;
			turnstile?: string;
		},
		{
			type: 'login' | 'signup';
			sentAgainAt: Date;
		}
	>(data.form, {
		resetForm: false,
		invalidateAll: false,
		multipleSubmits: 'prevent',
		delayMs: 500,
		timeoutMs: 2000,
		onError: createSuperFormGenericErrorHandler(toaster, routing.lang),
	});

	let result = $derived($message);
	let rateLimited = $derived(result?.sentAgainAt ? result.sentAgainAt > new Date() : false);
	function handleRateLimitEnd() {
		rateLimited = false;
	}
</script>

<SingleBoxPageLayout class="max-w-readable-tight space-y-6">
	<h1 class="c-text-heading-lg">
		<T key="pages.authenticate.heading" />
	</h1>
	<p>
		<T key="pages.authenticate.desc" params={{ mainSiteUrl: VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN }} />
	</p>
	<form class="space-y-6" use:enhance method="POST">
		<!-- cloudflare-turnstile -->
		<div class="space-y-1">
			<div class="c-text-body-sm flex items-baseline justify-between gap-6">
				<p class=""><T key="inputs.turnstile.desc" />:</p>
				{#if $errors.turnstile?.[0]}
					<p class="max-w-readable-tight c-text-body-sm text-right text-red-500">
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
				turnstile-language={routing.lang}
			>
				<!-- injected by @svelte-put/cloudflare-turnstile -->
			</div>
		</div>

		<!-- combined email input & submit button -->
		<div class="space-y-1">
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
						disabled={!!rateLimited}
					/>
				</label>
				<button
					class="c-btn px-4"
					type="submit"
					data-delayed={$delayed}
					data-timeout={$timeout}
					disabled={!!rateLimited}
					data-umami-event={result ? 'authenticate-resend' : 'authenticate-request'}
				>
					{#if result}
						<T key="pages.authenticate.resend" />
					{:else}
						<T key="continue" />
					{/if}
				</button>
			</div>
			{#if $errors.email?.[0]}
				<p class="c-text-body-sm text-red-500" id="error-email">{$errors.email[0]}</p>
			{/if}
		</div>
		{#if result}
			<output class="c-callout c-callout--info block" role="alert">
				{#if result.type === 'signup'}
					<T
						key="pages.authenticate.callout.signup"
						params={{ exp: formatRelativeTime(routing.lang, data.resentWaitingMs) }}
					/>
				{:else if result.type === 'login'}
					<T
						key="pages.authenticate.callout.login"
						params={{ exp: formatRelativeTime(routing.lang, data.resentWaitingMs) }}
					/>
				{/if}
				{#if rateLimited}
					<T key="pages.authenticate.callout.in" />
					<strong>
						<Countdown endAt={result.sentAgainAt} onEnd={handleRateLimitEnd} />
					</strong>
				{/if}
			</output>
		{:else if data.error}
			<output class="c-callout c-callout--error block" role="alert">
				{#if data.error === 'EXPIRED_TOKEN'}
					<T key="pages.authenticate.error.token_expired" />
				{:else if data.error === 'INVALID_TOKEN'}
					<T key="pages.authenticate.error.token_invalid" />
				{:else}
					<T key="pages.authenticate.error.generic" />
				{/if}
			</output>
		{/if}
	</form>
	<div class="flex items-center gap-2">
		<div class="bg-outline h-px flex-1"></div>
		<p class="text-on-surface-dim">
			<T key="or" />
		</p>
		<div class="bg-outline h-px flex-1"></div>
	</div>
	<p>
		<T
			key="pages.authenticate.headhunter"
			params={{ jobChannelUrl: 'https://discord.sveltevietnam.dev' }}
		/>
	</p>
</SingleBoxPageLayout>
