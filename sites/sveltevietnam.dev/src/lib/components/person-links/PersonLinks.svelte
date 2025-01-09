<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let { links, class: cls, ...rest }: HTMLAttributes<HTMLElement> & {
		links?: Record<string, string>;
	} = $props();

	let rLinks = $derived(links ? Object.entries(links) : []);
</script>

{#if rLinks.length}
	<ul class={['flex flex-wrap items-center gap-4', cls]} {...rest}>
		{#each rLinks as [name, href]}
			<li>
				<a
					class="c-link-icon flex rounded-full border border-current p-2"
					{href}
					data-external
				>
					{#if name === 'bluesky'}
						<svg class="h-6 w-6" inline-src="simpleicons/bluesky"></svg>
					{:else if name === 'github'}
						<svg class="h-6 w-6" inline-src="simpleicons/github"></svg>
					{:else}
						<i class="i i-[globe] h-6 w-6"></i>
					{/if}
					<span class="sr-only">{name}</span>
				</a>
			</li>
		{/each}
	</ul>
{/if}
