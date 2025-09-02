<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import { BaseNotification } from '../base-notification/index.js';

	import type { ToastProps } from '.';

	let { message, ...rest }: ToastProps = $props();
</script>

<BaseNotification {...rest}>
	<p>
		{#if typeof message === 'string'}
			{message}
		{:else}
			<T {message} />
		{/if}
	</p>
</BaseNotification>
