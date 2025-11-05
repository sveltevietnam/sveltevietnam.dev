<script lang="ts" module>
	import { DialogPortal } from '../../dialogs';
	import { NotificationPortal } from '../../notifications';

	import { type ContextsProviderProps } from '.';
</script>

<script lang="ts">
	let { children, contexts }: ContextsProviderProps = $props();
</script>

<svelte:document {@attach contexts.lockscroll.apply()} />

{@render children?.()}
<DialogPortal stack={contexts.dialogs} />
<NotificationPortal stack={contexts.notifications.stack} />
