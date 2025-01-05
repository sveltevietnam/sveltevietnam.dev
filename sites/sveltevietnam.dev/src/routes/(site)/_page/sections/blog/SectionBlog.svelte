<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	let { locale }: { locale: import('./locales/generated').Locale } = $props();
</script>

<section>
	<h2><T message={locale.heading} /></h2>
</section>
