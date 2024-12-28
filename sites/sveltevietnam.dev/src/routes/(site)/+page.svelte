<script lang="ts">
	import { T } from '@internals/i18n';

	let { data } = $props();

	let t = $derived(data.t);
</script>

<main>
	<h1><T message={t.sveltevietnam} /></h1>
	<section>
		<h2><T message={t.page.one_heading} /></h2>
		<p>
			<T message={t.page.one_description} />
		</p>
	</section>
</main>
