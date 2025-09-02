<script lang="ts">
	import { turnstile } from '@svelte-put/cloudflare-turnstile';
	import { T } from '@sveltevietnam/i18n';
	import { Contexts } from '@sveltevietnam/kit/contexts';
	import { superForm } from 'sveltekit-superforms';

	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import {
		VITE_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY,
		VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN,
	} from '$env/static/public';
	import { SingleBoxPageLayout } from '$lib/components/single-box-page-layout';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const { routing } = Contexts.get();

	const { form, enhance, constraints, errors, delayed, timeout } = superForm(data.form, {
		resetForm: false,
		invalidateAll: false,
		multipleSubmits: 'prevent',
		delayMs: 500,
		timeoutMs: 2000,
	});
</script>

<SingleBoxPageLayout class="max-w-readable-tight space-y-6">
	<h1 class="c-text-heading-lg">
		<T message={m['pages.login.heading']} />
	</h1>
	<p>
		<T message={m['pages.login.desc']} mainSiteUrl={VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN} />
	</p>
	<form class="space-y-6" use:enhance method="POST" action="?/login">
		<!-- cloudflare-turnstile -->
		<div class="space-y-1">
			<div class="c-text-body-sm flex items-baseline justify-between gap-6">
				<p class=""><T message={m['inputs.turnstile.desc']} />:</p>
				{#if $errors.turnstile?.[0]}
					<p class="max-w-readable-tight text-right c-text-body-sm text-red-500">
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
			<p class="c-text-body-sm">
				<T message={m['pages.login.input']} />:
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
					<T message={m.continue} />
				</button>
			</div>
			{#if $errors.email?.[0]}
				<p class="c-text-body-sm text-red-500" id="error-email">{$errors.email[0]}</p>
			{/if}
		</div>
	</form>
	<p class="c-callout c-callout--info">
		<T message={m['pages.login.callout']} />
		<strong>01:33</strong>.
	</p>
	<div class="flex items-center gap-2">
		<div class="bg-outline h-px flex-1"></div>
		<p class="text-on-surface-dim">
			<T message={m.or} />
		</p>
		<div class="bg-outline h-px flex-1"></div>
	</div>
	<a class="c-btn c-btn--outlined block w-full" href={p['/:lang/signup']({ lang: routing.lang })}>
		<T message={m['pages.login.signup']} />
	</a>
	<p>
		<T message={m['pages.login.headhunter']} jobChannelUrl="https://discord.sveltevietnam.dev" />
	</p>
</SingleBoxPageLayout>
