import { Stack, stack } from '@svelte-put/async-stack';
import { getContext, setContext } from 'svelte';

export class DialogContext {
	static KEY = 'app:dialogs';

	static set() {
		return setContext<Stack>(DialogContext.KEY, stack().build());
	}

	static get() {
		return getContext<Stack>(DialogContext.KEY);
	}
}
