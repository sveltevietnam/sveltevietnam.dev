import {
	arrow,
	autoUpdate,
	computePosition,
	offset,
	shift,
	autoPlacement,
	type Placement,
} from '@floating-ui/dom';
import { prepare } from '@svelte-put/tooltip';

import TextTooltip from './TextTooltip.svelte';

export const textTip = prepare({
	content: {
		component: TextTooltip,
	},
	target: 'parent',
	debounce: 120,
	class: 'c-tooltip',
	compute: async ({ node, tooltip }) => {
		const arrowEl = document.createElement('div');
		arrowEl.className = 'c-tooltip-arrow';
		tooltip.appendChild(arrowEl);

		const placementPreference = node.getAttribute('data-tooltip-placement') as Placement | null;
		const tElement = tooltip as HTMLElement;
		autoUpdate(node, tElement, async () => {
			const { x, y, middlewareData, placement } = await computePosition(node, tElement, {
				...(placementPreference
					? {
							placement: placementPreference,
						}
					: {}),
				middleware: [
					offset(12),
					...(!placementPreference ? [autoPlacement()] : []),
					arrow({
						element: arrowEl,
					}),
					shift(),
				],
			});
			tElement.style.left = `${x}px`;
			tElement.style.top = `${y}px`;

			const staticSide = (
				{
					top: 'bottom',
					right: 'left',
					bottom: 'top',
					left: 'right',
				} as const
			)[placement.split('-')[0]];

			if (placement.includes('top')) {
				arrowEl.style.bottom = `${middlewareData.arrow?.y ?? 0}px`;
			} else {
				arrowEl.style.top = `${middlewareData.arrow?.y ?? 0}px`;
			}
			if (placement.includes('left')) {
				arrowEl.style.right = `${middlewareData.arrow?.x ?? 0}px`;
			} else {
				arrowEl.style.left = `${middlewareData.arrow?.x ?? 0}px`;
			}

			if (staticSide) arrowEl.style[staticSide] = '-4px';
		});
	},
});
