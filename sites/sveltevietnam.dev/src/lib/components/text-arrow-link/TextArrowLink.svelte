<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	let { children, class: cls, ...rest }: HTMLAnchorAttributes = $props();
</script>

<a class={['c-link-lazy group/link', cls]} {...rest}>
	{@render children?.()}
	<i class="i i-[arrow-right] h-5 w-5 transition-transform group-hover/link:translate-x-1"></i>
</a>
