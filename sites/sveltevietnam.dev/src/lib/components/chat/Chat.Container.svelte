<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import { setChatContext, type ChatDisplay } from './context';

	let {
		display = 'bubble',
		children,
		class: cls,
		...rest
	}: HTMLAttributes<HTMLOListElement> & {
		display?: ChatDisplay;
	} = $props();

	setChatContext({ display });
</script>

<ol class={['list-none px-0', cls]} {...rest}>
	{@render children?.()}
</ol>
