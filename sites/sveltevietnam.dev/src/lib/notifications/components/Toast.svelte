<script lang="ts" module>
	import { T } from '@sveltevietnam/i18n';
	import { type Message, type MessageType } from '@sveltevietnam/i18n/runtime';

	import type { BaseNotificationProps } from './BaseNotification.svelte';

	export interface ToastProps extends BaseNotificationProps {
		message: string | Message<MessageType, never>;
	}
</script>

<script lang="ts">
	import BaseNotification from './BaseNotification.svelte';

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
