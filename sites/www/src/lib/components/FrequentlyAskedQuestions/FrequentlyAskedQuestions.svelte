<script lang="ts">
	export let entries: { q: string; a: string }[];
	let cls = '';
	export { cls as class };
</script>

<ul class={cls}>
	{#each entries as { q, a }}
		<li class=" border-b">
			<label class="group block cursor-pointer py-4">
				<div class="flex items-start justify-between group-hover:text-link">
					<p class="c-text-h5 font-medium">{@html q}</p>
					<svg inline-src="lucide/chevron-down" stroke-width="2" class="shrink-0" />
				</div>
				<input type="checkbox" class="sr-only" />
				<div class="accordion">
					<div class="overflow-hidden">
						<p class="mx-2 mt-4 px-2 py-2 tb:mx-6">{@html a}</p>
					</div>
				</div>
			</label>
		</li>
	{/each}
</ul>

<style lang="postcss">
	.accordion {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 150ms ease-out;
	}

	svg {
		transition: transform 150ms ease-out;
	}

	li:has(input:checked) {
		& .accordion {
			grid-template-rows: 1fr;
		}

		& svg {
			transform: rotate(180deg);
		}
	}
</style>
