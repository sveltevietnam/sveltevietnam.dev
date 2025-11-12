import { Context as I18NContext } from '@sveltevietnam/i18n';

import { DialogContext } from '../dialogs/index.js';
import { NotificationContext } from '../notifications/index.js';

import { ColorSchemeContext } from './color-scheme.svelte.js';
import { LoadingContext } from './loading.svelte.js';
import { LockScrollContext } from './lockscroll.svelte.js';
import { RoutingContext } from './routing.svelte.js';

/**
 * @typedef CreateContextsInput
 * @property {() => import('./routing.svelte').RoutingContextInit} routing
 * @property {() => import('./color-scheme.svelte').ColorSchemeContextInit} colorScheme
 * @property {() => import('@sveltevietnam/i18n').ContextInit} i18n
 * @property {import('./loading.svelte.js').LoadingAutoTriggers} globalLoading
 */

/**
 * For immediate use after creation
 * @typedef CreateContextsOutput
 * @property {RoutingContext} routing
 * @property {LockScrollContext} lockscroll
 * @property {ColorSchemeContext} colorScheme
 * @property {import('@svelte-put/async-stack').Stack} dialogs
 * @property {NotificationContext} notifications
 * @property {I18NContext} i18n
 * @property {LoadingContext} globalLoading
 */

/**
 * @param {CreateContextsInput} input
 * @returns {CreateContextsOutput}
 */
export function createContexts(input) {
	return {
		routing: RoutingContext.set(input.routing),
		lockscroll: LockScrollContext.set(),
		colorScheme: ColorSchemeContext.set(input.colorScheme),
		dialogs: DialogContext.set(),
		notifications: NotificationContext.set(),
		i18n: I18NContext.set(input.i18n),
		globalLoading: LoadingContext.setGlobal(input.globalLoading),
	};
}

export * from './color-scheme.svelte.js';
export * from './routing.svelte.js';
export * from './lockscroll.svelte.js';
export * from './loading.svelte.js';
export * from '../notifications/context/index.svelte.js';
export * from '../dialogs/context.svelte.js';
