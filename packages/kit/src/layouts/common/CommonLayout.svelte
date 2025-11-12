<script lang="ts">
	import { LoadingBar } from '../../components';
	import { DialogPortal } from '../../dialogs/portal';
	import { NotificationPortal } from '../../notifications/portal';

	import type { CommonLayoutProps } from '.';

	let { children, dialogs, lockscroll, notifications, globalLoading }: CommonLayoutProps = $props();
</script>

<svelte:document {@attach lockscroll?.apply()} />

{#await globalLoading?.done()}
	<LoadingBar />
{/await}

{@render children?.()}

{#if dialogs}
	<DialogPortal stack={dialogs} />
{/if}

{#if notifications}
	<NotificationPortal stack={notifications.stack} />
{/if}
