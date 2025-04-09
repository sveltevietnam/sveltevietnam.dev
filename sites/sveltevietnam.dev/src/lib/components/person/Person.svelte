<script lang="ts" module>
	import type { Picture } from "vite-imagetools";

	import { Avatar } from '$lib/components/avatar';

	interface PersonProps	{
		name: string;
		description?: string;
		href?: string;
		avatar?: string | Picture;
	}
</script>

<script lang="ts">
	let { name, href, avatar, description }: PersonProps = $props();
</script>

{#snippet avatarSnip()}
		<Avatar class="h-12 w-12 object-top" src={avatar} {name} border="ellipse" />
{/snippet}

<article class="flex items-center gap-3">
	{#if href}
		<a {href}>
			{@render avatarSnip()}
		</a>
	{:else}
		{@render avatarSnip()}
	{/if}
	<div>
		<p class="font-bold">
			<a class="c-link-lazy" {href}>{name}</a>
		</p>
		{#if description}
			<p class="text-on-surface-subtle">{description}</p>
		{/if}
	</div>
</article>
