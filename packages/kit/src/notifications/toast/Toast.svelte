<script lang="ts">
	import { BaseNotification } from '../base-notification/index.js';

	import type { ToastProps } from '.';

	let { message, ...rest }: ToastProps = $props();
</script>

<BaseNotification {...rest}>
	<p>
		{#if typeof message === 'function'}
			{@render message()}
		{:else}
			{await message}
		{/if}
	</p>
</BaseNotification>
