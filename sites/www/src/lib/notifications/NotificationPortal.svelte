<script lang="ts">
	import Notification from '@svelte-put/noti/Notification.svelte';
	import { flip } from 'svelte/animate';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	import { getNotificationContext } from '.';

	const { store } = getNotificationContext();
</script>

<!-- notification portal, typically setup at somewhere global like root layout -->
<div class="notification-portal" role="log" aria-label="notifications">
	{#each $store.notifications as notification (notification.id)}
		<div animate:flip={{ duration: 200 }}>
			<div transition:fly={{ duration: 280, x: 80, easing: cubicOut }}>
				<Notification {notification} />
			</div>
		</div>
	{/each}
</div>

<style lang="postcss">
	.notification-portal {
		pointer-events: auto;

		position: fixed;
		z-index: theme('zIndex.notification');
		top: calc(8px + theme('spacing.header'));
		right: 8px;

		display: flex;
		flex-direction: column-reverse;
		gap: 16px;
		align-items: flex-end;
		justify-content: flex-start;

		@screen upto-tb {
			left: 8px;
		}

		@screen tb {
			right: 8px;
			max-width: 560px;
		}
	}
</style>
