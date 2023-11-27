import { arrow, autoUpdate, computePosition, offset, shift, autoPlacement } from '@floating-ui/dom';
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
		tooltip.prepend(arrowEl);

		const tElement = tooltip as HTMLElement;
		autoUpdate(node, tElement, async () => {
			const { x, y, middlewareData, placement } = await computePosition(node, tElement, {
				middleware: [
					offset(16),
					arrow({
						element: arrowEl,
					}),
					autoPlacement(),
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

			arrowEl.style.left = `${middlewareData.arrow?.x ?? 0}px`;
			arrowEl.style.top = `${middlewareData.arrow?.y ?? 0}px`;
			if (staticSide) arrowEl.style[staticSide] = '-4px';
		});
	},
});
