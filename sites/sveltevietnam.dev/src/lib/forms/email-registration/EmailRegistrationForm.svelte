<script lang="ts">
	import { turnstile } from '@svelte-put/cloudflare-turnstile';
	import { T } from '@sveltevietnam/i18n';
	import type { HTMLFormAttributes } from 'svelte/elements';

	import * as m from '$data/locales/generated/messages';
	import { VITE_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY } from '$env/static/public';
	import { SettingsContext } from '$lib/settings/context.svelte';

	let {
		class: cls,
		...rest
	}: HTMLFormAttributes = $props();

	const settings = SettingsContext.get();
</script>

<form class={["space-y-6", cls]} {...rest}>
	<div class="space-y-4">
		<div class="space-y-1">
			<label class="c-text-body-sm block" for="name">
				<T message={m['forms.name']} />:
			</label>
			<input
				class="c-text-input w-full"
				type="text"
				name="name"
				id="name"
				placeholder="Văn Vũ / Phương Phạm / ..."
			/>
		</div>
		<div class="space-y-1">
			<label class="c-text-body-sm block" for="email">Email:</label>
			<input
				class="c-text-input w-full"
				type="email"
				name="email"
				id="email"
				placeholder="email@example.com"
			/>
		</div>
		<div class="space-y-1">
			<p class="c-text-body-sm"><T message={m['forms.turnstile.desc']} />:</p>
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
	<button class="c-btn c-btn--pop px-4" type="submit">
		<span><T message={m['forms.register']} /></span>
	</button>
</form>
