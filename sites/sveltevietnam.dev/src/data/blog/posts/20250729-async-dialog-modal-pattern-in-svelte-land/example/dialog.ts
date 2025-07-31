import { stack } from '@svelte-put/async-stack';

// :::highlight
/** base stack structure to store and render dialogs into a portal */
export const dialogStack = stack().build();
// :::
