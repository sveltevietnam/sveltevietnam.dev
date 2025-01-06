<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	let { locale }: { locale: import('./locales/generated').Locale } = $props();
</script>

<section class="max-w-pad py-section space-y-10">
	<div class="space-y-6 text-center">
		<h2 class="c-text-heading-lg"><T message={locale.heading} /></h2>
		<p class="mx-auto max-w-[70ch]"><T message={locale.description} /></p>
	</div>
</section>
