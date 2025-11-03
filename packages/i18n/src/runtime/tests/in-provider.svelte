<script lang="ts">
	import type { ComponentProps } from 'svelte';

	import { T } from '../T';
	import { Provider, type ContextInit } from '../context';

	let {
		context,
		t,
	}: {
		context: ContextInit;
		t: ComponentProps<typeof T>;
	} = $props();
</script>

<Provider {...context}>
	<T {...t} />
</Provider>
