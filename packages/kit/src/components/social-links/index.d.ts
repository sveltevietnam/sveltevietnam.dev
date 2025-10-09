import type { Component } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface SocialLinksProps extends HTMLAttributes<HTMLUListElement> {
	/** a unique marker for where this is rendered - e.g. header, footer, etc. - used for umami tracking */
	position: string;
}
export const SocialLinks: Component<SocialLinksProps>;
