<script lang="ts">
	import type { ComponentProps } from 'svelte';

	import { T } from '../T';
	import { Provider } from '../context';

	let {
		lang,
		tProp,
	}: {
		lang: 'en' | 'vi';
		tProp: ComponentProps<typeof T>;
	} = $props();
</script>

<Provider {lang}>
	<T {...tProp} />
</Provider>
