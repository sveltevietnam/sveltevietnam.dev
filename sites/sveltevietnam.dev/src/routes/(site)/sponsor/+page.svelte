<script lang="ts">
	import { T } from "@internals/i18n";

	let { data } = $props();

	let locales = $derived(data.locales.page as import('./_page/locales/generated').Locale);
</script>

<h1><T message={locales.page_heading} /></h1>
<p><T message={locales.page_subtile} /></p>
