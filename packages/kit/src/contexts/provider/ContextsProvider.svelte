<script lang="ts" module>
	import { setContext } from 'svelte';

	import { DialogPortal } from '../../dialogs';
	import { NotificationPortal } from '../../notifications';

	import { type ContextsProviderProps } from '.';
</script>

<script lang="ts">
	let { children, contexts }: ContextsProviderProps = $props();

	// FIXME: extract to i18n package
	// for @sveltevietnam/i18n T.svelte component
	setContext('t:lang', () => contexts.routing.lang);
</script>

{@render children?.()}

<svelte:document {@attach contexts.lockscroll.apply()} />
<DialogPortal stack={contexts.dialogs} />
<NotificationPortal stack={contexts.notifications.stack} />
