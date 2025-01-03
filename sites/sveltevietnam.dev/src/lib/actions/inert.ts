/**
 * Workaround for https://github.com/sveltejs/svelte/issues/14731
 * to support correct inert behavior during SSR.
 *
 * Simply revert to setting `inert` attribute on the Element
 * once the aforementioned issue is resolved.
 */
export const inert = function (node: Element, inert?: boolean) {
	node.toggleAttribute('inert', inert);
	return {
		update(inert) {
			node.toggleAttribute('inert', inert);
		}
	};
} satisfies import('svelte/action').Action;

