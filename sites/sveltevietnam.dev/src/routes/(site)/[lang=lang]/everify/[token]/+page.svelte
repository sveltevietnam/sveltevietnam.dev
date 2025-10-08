<script lang="ts">
	import { T } from '@sveltevietnam/i18n/runtime';
	import { Contexts } from '@sveltevietnam/kit/contexts';

	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const { routing } = Contexts.get();
</script>

<main
	class="max-w-pad bg-gradient-primary-intro flex flex-1 flex-col items-center justify-center gap-4 pb-32 pt-40"
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
	<a class="c-btn c-btn--pop mt-4 block" href={p['/:lang']({ lang: routing.lang })}>
		<T message={m['pages.everify.go_to_home']} />
	</a>
</main>
