import type { Component, Snippet } from 'svelte';

/** context provider for i18n */
export interface ProviderProps<
	Language extends string = import('@sveltevietnam/i18n/generated').Language,
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
export default Provider;
