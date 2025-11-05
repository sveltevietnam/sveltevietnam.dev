import { Context as I18NContext } from '@sveltevietnam/i18n';

import { DialogContext } from '../../dialogs/index.js';
import { NotificationContext } from '../../notifications/index.js';
import { ColorSchemeContext } from '../color-scheme.svelte';
import { LockScrollContext } from '../lockscroll.svelte';
import { RoutingContext } from '../routing.svelte';

/**
 * @typedef CreateContextsInput
 * @property {() => import('../routing.svelte').RoutingContextInit} routing
 * @property {() => import('../color-scheme.svelte').ColorSchemeContextInit} colorScheme
 * @property {() => import('@sveltevietnam/i18n').ContextInit} i18n
 */

/**
 * For immediate use after creation
 * @typedef CreateContextsOutput
 * @property {RoutingContext} routing
 * @property {LockScrollContext} lockscroll
 * @property {ColorSchemeContext} colorScheme
 * @property {DialogContext} dialogs
 * @property {NotificationContext} notifications
 * @property {I18NContext} i18n
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
	};
}

export { default as Provider } from './Provider.svelte';
