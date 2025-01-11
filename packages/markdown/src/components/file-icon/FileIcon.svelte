<script lang="ts" module>
	const modules = import.meta.glob<string>('./images/*.svg', {
		import: 'default',
		query: '?url',
		eager: true,
	});
</script>

<script lang="ts">
	let { lang }: { lang: string } = $props();

	let url = $derived(modules[lang] || modules['file-code']);
</script>

<i style:--url={url}></i>

