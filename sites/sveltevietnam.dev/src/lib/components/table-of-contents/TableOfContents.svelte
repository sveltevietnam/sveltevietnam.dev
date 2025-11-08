<script lang="ts" module>
	import type { Toc, TocItem } from '@svelte-put/toc';
	import type { HTMLAttributes } from 'svelte/elements';

	export type TocNode = {
		item: TocItem;
		children: TocNode[];
		parents: TocNode[];
	};

	export function buildTocNodes(items: TocItem[]): TocNode[] {
		const nodes: TocNode[] = [];

		let prevLevel = 1;
		let currentNode: TocNode | undefined = undefined;
		for (const item of items) {
			const level = parseInt(item.element.tagName.slice(1)) - 1;

			if (!currentNode) {
				currentNode = {
					item,
					children: [],
					parents: [],
				};
				nodes.push(currentNode);
				prevLevel = level;
				continue;
			}

			if (level <= prevLevel) {
				const diff = level - prevLevel - 1;
				const parent = currentNode?.parents.at(diff);
				if (parent) {
					currentNode = {
						item,
						children: [],
						parents: [...parent.parents, parent],
					};
					parent.children.push(currentNode);
				} else {
					currentNode = {
						item,
						children: [],
						parents: [],
					};
					nodes.push(currentNode);
				}
			} else {
				const parent: TocNode = currentNode;
				currentNode = {
					item,
					children: [],
					parents: [...parent.parents, parent],
				};
				parent.children.push(currentNode);
			}

			prevLevel = level;
		}

		return nodes;
	}
</script>

<script lang="ts">
	let {
		toc,
		class: cls,
		...rest
	}: HTMLAttributes<HTMLUListElement> & {
		toc: Toc;
	} = $props();
</script>

{#snippet sNode(toc: Toc, node: TocNode)}
	<li>
		<!-- svelte-ignore a11y_missing_attribute -->
		<a use:toc.actions.link={node.item} class="c-link-lazy current:text-link block py-1 capitalize">
			<!-- textContent injected by toc -->
		</a>
		{#if node.children.length > 0}
			<ul class="border-outline ml-4 border-l pl-4">
				{#each node.children as child (child.item.id)}
					{@render sNode(toc, child)}
				{/each}
			</ul>
		{/if}
	</li>
{/snippet}

<ul class={['tablet:max-h-[70vh] overflow-auto', cls]} {...rest}>
	{#each buildTocNodes(Array.from(toc.items.values())) as node (node.item.id)}
		{@render sNode(toc, node)}
	{/each}
</ul>
