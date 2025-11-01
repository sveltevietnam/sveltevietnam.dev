<script lang="ts">
	let { content }: { content: string } = $props();
</script>

<!-- @component workaround for T.svelte, because at the moment, `{@html await ...}` seems to fail -->

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html content}
