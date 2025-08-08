<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import { SettingsContext } from '$lib/settings/context.svelte';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let settings = SettingsContext.get();
</script>

<main
	class="max-w-pad bg-gradient-primary-intro pt-40 pb-32 flex flex-1 flex-col items-center justify-center gap-4"
>
	<h1 class="sr-only">
		<T message={m['pages.everify.heading']} />
	</h1>
	<div class="i i-[ph--check-circle] text-success-on-surface h-20 w-20"></div>
	<p class="c-text-title text-success-on-surface text-center">
		{#if data.verified}
			<T message={m['pages.everify.already']} />
		{:else}
			<T message={m['pages.everify.success']} />
		{/if}
	</p>
	<a class="c-btn c-btn--pop mt-4 block" href={p['/:lang']({ lang: settings.language })}>
		<T message={m['pages.everify.go_to_home']} />
	</a>
</main>
