<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	import { Breadcrumbs } from '$lib/components/breadcrumbs';
	import { IntroSeparator } from '$lib/components/intro-separator';

	let {
		children,
		breadcrumbs,
		heading,
		description,
		class: cls,
		...rest
	}: {
		breadcrumbs: { path: string; name: string }[];
		heading?: Snippet<[]> | string;
		description?: Snippet<[]> | string;
	} & HTMLAttributes<HTMLElement> = $props();
</script>

<section class={['space-y-section pt-intro-pad-top bg-gradient-primary-intro', cls]} {...rest}>
	<div class="max-w-pad space-y-10">
		<Breadcrumbs crumbs={breadcrumbs} />
		{#if children}
			{@render children()}
		{:else}
			<div class="space-y-4">
				{#if heading}
					<h1 class="c-text-heading-page text-primary-on-surface">
						{#if typeof heading === 'function'}
							{@render heading()}
						{:else}
							{heading}
						{/if}
					</h1>
				{/if}
				{#if description}
					<p class="c-text-subtitle-page max-w-readable leading-relaxed">
						{#if typeof description === 'function'}
							{@render description()}
						{:else}
							{description}
						{/if}
					</p>
				{/if}
			</div>
		{/if}
	</div>
	<IntroSeparator variant="pen" />
</section>
