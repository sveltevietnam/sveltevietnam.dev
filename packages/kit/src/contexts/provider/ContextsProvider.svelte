<script lang="ts" module>
	import { getContext, setContext } from 'svelte';

	import { ColorSchemeContext, LockScrollContext, RoutingContext } from '..';
	import { DialogContext, DialogPortal } from '../../dialogs';

	import { type ContextsProviderProps, Contexts as IContexts, type ContextsInit } from '.';

	/**
	 * call internally to set all contexts
	 */
	export class Contexts implements IContexts {
		static KEY = Symbol('app:contexts');

		routing: ReturnType<typeof RoutingContext.set>;
		lockscroll: ReturnType<typeof LockScrollContext.set>;
		colorScheme: ReturnType<typeof ColorSchemeContext.set>;
		dialogs: ReturnType<typeof DialogContext.set>;

		constructor(init: ContextsInit) {
			this.routing = RoutingContext.set(init.routing);
			this.lockscroll = LockScrollContext.set();
			this.colorScheme = ColorSchemeContext.set(init.colorScheme);
			this.dialogs = DialogContext.set();
		}

		static set(inits: ContextsInit) {
			return setContext<Contexts>(Contexts.KEY, new Contexts(inits));
		}

		static get() {
			return getContext<Contexts>(Contexts.KEY);
		}
	}
</script>

<script lang="ts">
	let {
		children,
		contexts,
	}: ContextsProviderProps = $props();

	// FIXME: extract to i18n package
	// for @sveltevietnam/i18n T.svelte component
	setContext('t:lang', () => contexts.routing.lang);
</script>

{@render children?.()}

<svelte:document {@attach contexts.lockscroll.apply()} />
<DialogPortal stack={contexts.dialogs} />
