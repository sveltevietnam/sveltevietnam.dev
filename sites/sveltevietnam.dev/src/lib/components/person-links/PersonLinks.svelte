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

	const icons = {
		github: 'i-[simple-icons--github]',
		twitter: 'i-[simple-icons--x]',
		x: 'i-[simple-icons--x]',
		linkedin: 'i-[simple-icons--linkedin]',
		bluesky: 'i-[simple-icons--bluesky]',
	} as Record<string, string>;
</script>

{#if rLinks.length}
	<ul class={['flex flex-wrap items-center gap-4', cls]} {...rest}>
		{#each rLinks as [name, href] (name)}
			<li>
				<a
					class={[
						'c-link-icon flex rounded-full border-onehalf border-current',
						name in icons ? 'p-3' : 'p-2',
					]}
					{href}
					data-external
				>
					{#if name in icons}
						<i class="i {icons[name]} h-5 w-5"></i>
					{:else}
						<i class="i i-[ph--globe] h-6 w-6"></i>
					{/if}
					<span class="sr-only">{name}</span>
				</a>
			</li>
		{/each}
	</ul>
{/if}
