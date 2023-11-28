<script lang="ts">
	import type { LocalizedPerson } from '$shared/data/people';

	export let person: LocalizedPerson;
	let cls = '';
	export { cls as class };
</script>

<div class="flex items-center gap-3 {cls}">
	{#if person.link}
		<a href={person.link} external class="c-link c-link--image clip-ellipse">
			<span class="sr-only">{person.name}</span>
			<img
				src={person.avatarUrl}
				alt={person.name}
				class="c-avatar c-avatar--ellipse h-12 w-12"
				height="48"
				width="48"
			/>
		</a>
	{:else}
		<!-- TODO: candidate for Svelte 5 snippet -->
		<img
			src={person.avatarUrl}
			alt={person.name}
			class="c-avatar c-avatar--ellipse h-12 w-12"
			height="48"
			width="48"
		/>
	{/if}
	<div>
		<p class="font-medium">
			{#if person.link}
				<a href={person.link} class="c-link c-link--preserved" external>
					{person.name}
				</a>
			{:else}
				{person.name}
			{/if}
		</p>
		<p class="tp-cap1 text-fg-200">{person.title}</p>
	</div>
</div>
