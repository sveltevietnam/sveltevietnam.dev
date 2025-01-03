<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	let { data } = $props();

	let locales = $derived(data.locales.page as import('./_page/locales/generated').Locale);
</script>

<!-- <main> -->
<!-- 	<h1><T message={locales.page_heading} /></h1> -->
<!-- 	<div class="i i-sveltevietnam w-10 h-10"></div> -->
<!-- 	<div class="i i-[info--duotone] w-10 h-10 text-primary"></div> -->
<!-- </main> -->
