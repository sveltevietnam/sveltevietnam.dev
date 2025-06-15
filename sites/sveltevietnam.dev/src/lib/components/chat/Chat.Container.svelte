<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import { setChatContext, type ChatParticipantMap, type ChatDisplay } from './context';

	let {
		participants = {},
		display = 'bubble',
		children,
		class: cls,
		...rest
	}: HTMLAttributes<HTMLOListElement> & {
		participants?: ChatParticipantMap;
		display?: ChatDisplay;
	} = $props();

	setChatContext({ participants, display });
</script>

<ol class={['list-none px-0', cls]} {...rest}>
	{@render children?.()}
</ol>
