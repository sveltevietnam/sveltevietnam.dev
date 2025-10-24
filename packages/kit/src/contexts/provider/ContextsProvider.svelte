<script lang="ts" module>
	import { Provider as I18NProvider } from '@sveltevietnam/i18n-new';
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

<I18NProvider lang={contexts.routing.lang}>
	{@render children?.()}
</I18NProvider>

<svelte:document {@attach contexts.lockscroll.apply()} />
<DialogPortal stack={contexts.dialogs} />
<NotificationPortal stack={contexts.notifications.stack} />
