<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import { setChatContext, type ChatParticipantMap } from './context';

	let {
		participants = {},
		children,
		class: cls,
		...rest
	}: HTMLAttributes<HTMLOListElement> & {
		participants?: ChatParticipantMap;
	} = $props();

	setChatContext({ participants });
</script>

<ol class={['list-none p-0 space-y-4', cls]} {...rest}>
	{@render children?.()}
</ol>
