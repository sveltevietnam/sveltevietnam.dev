import type { Component } from 'svelte';
import { HTMLAttributes } from 'svelte/elements';

export type TBAProps = HTMLAttributes<HTMLElement>;

/**
 * container box layout for to-be-announced UI,
 * helpful for list empty state and such
 */
export const TBA: Component<TBAProps>;
