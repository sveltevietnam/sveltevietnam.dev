<script lang="ts" module>
	import { T } from '@sveltevietnam/i18n';
	import type { KeySimple } from '@sveltevietnam/i18n/generated';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type FAQItemProps = HTMLAttributes<HTMLLIElement> & {
		question: KeySimple | Snippet<[]>;
		answer: KeySimple | Snippet<[]>;
	};
</script>

<script lang="ts">
	let { question, answer }: FAQItemProps = $props();
</script>

<li class="group/faq border-b">
	<label class="c-link-lazy block py-4">
		<span class="flex items-start justify-between gap-1">
			<span class="c-text-body-md font-medium">
				{#if typeof question === 'function'}
					{@render question()}
				{:else}
					<T key={question} />
				{/if}
			</span>
			<input type="checkbox" class="peer sr-only" />
			<i
				class="i i-[ph--caret-down] block h-6 w-6 shrink-0 transition-transform
				duration-300 ease-out peer-checked:rotate-180 peer-checked:duration-100 peer-checked:ease-in"
			></i>
		</span>
	</label>
	<div
		class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-has-checked:ease-in group-has-checked/faq:grid-rows-[1fr] group-has-checked/faq:duration-100"
	>
		<div class="overflow-hidden">
			<p class="tablet:mx-6 mx-2 px-2 pb-4">
				{#if typeof answer === 'function'}
					{@render answer()}
				{:else}
					<T key={answer} />
				{/if}
			</p>
		</div>
	</div>
</li>
