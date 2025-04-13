<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		links,
		class: cls,
		...rest
	}: HTMLAttributes<HTMLElement> & {
		links?: Record<string, string>;
	} = $props();

	let rLinks = $derived(links ? Object.entries(links) : []);
</script>

{#if rLinks.length}
	<ul class={['flex flex-wrap items-center gap-4', cls]} {...rest}>
		{#each rLinks as [name, href] (name)}
			<li>
				<a class="c-link-icon flex rounded-full border border-current p-2" {href} data-external>
					{#if name === 'bluesky'}
						<i class="i i-[simple-icons--bluesky] h-6 w-6"></i>
					{:else if name === 'github'}
						<i class="i i-[simple-icons--github] h-6 w-6"></i>
					{:else if name === 'x'}
						<i class="i i-[simple-icons--x] h-6 w-6"></i>
					{:else}
						<i class="i i-[ph--globe] h-6 w-6"></i>
					{/if}
					<span class="sr-only">{name}</span>
				</a>
			</li>
		{/each}
	</ul>
{/if}
