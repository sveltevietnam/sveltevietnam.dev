<script lang="ts">
	import { T } from "@sveltevietnam/i18n";

	let { data } = $props();

	let locales = $derived(data.locales.page as import('./_page/locales/generated').Locale);
</script>

<p><T message={locales.word} /></p>
