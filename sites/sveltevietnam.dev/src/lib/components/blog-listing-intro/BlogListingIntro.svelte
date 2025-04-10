<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	import { Breadcrumbs } from '$lib/components/breadcrumbs';

	let {
		children,
		breadcrumbs,
		heading,
		description,
		class: cls,
		...rest
	}: {
		breadcrumbs: App.Route[];
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
					<p class="c-text-subtitle-page max-w-readable">
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
	<div class="flex items-center gap-3">
		<div class="bg-primary h-10 w-10"></div>
		<div class="bg-primary h-10 flex-1"></div>
		<svg
			class="h-10 w-14"
			width="56"
			height="40"
			viewBox="0 0 56 40"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M56 20L0 40L2.82652e-06 0L56 20Z" fill="var(--color-primary)" />
		</svg>
	</div>
</section>
