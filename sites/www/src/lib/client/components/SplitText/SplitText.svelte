<script lang="ts">
	export let text = '';

	$: words = text.split(' ');
</script>

{#each words as word, i}
	<span class="word relative inline-block">
		{#each word as char}
			<span class="char relative inline-block">{char}</span>
		{/each}
	</span>
	{#if i < words.length - 1}
		<span> </span>
	{/if}
{/each}
