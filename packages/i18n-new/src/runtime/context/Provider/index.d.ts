import type { Component, Snippet } from 'svelte';

import { $$Runtime } from '@sveltevietnam/i18n-new/generated';

/** context provider for i18n */
export interface ProviderProps<
	Language extends string = ReturnType<$$Runtime>['languages'][number],
> {
	/**
	 * the current language of the app,
	 * updates to this prop should propagate to all `T.svelte` instances
	 */
	lang: Language;
	/**
	 * a custom `sanitize` function to sanitize the message content before rendering,
	 * @default import('sanitize-html').default
	 */
	sanitize?: (content: string) => string;
	children: Snippet;
}
export const Provider: Component<ProviderProps>;
