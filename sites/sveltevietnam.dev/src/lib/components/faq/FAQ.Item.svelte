<script lang="ts" module>
	import { T } from '@sveltevietnam/i18n';
	import { isMessage, type Message, type MessageType } from '@sveltevietnam/i18n/runtime';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type FAQItemProps = HTMLAttributes<HTMLLIElement> & {
		question: Message<MessageType, never> | Snippet<[]>;
		answer: Message<MessageType, never> | Snippet<[]>;
	};
</script>

<script lang="ts">
	let { question, answer }: FAQItemProps = $props();
</script>

<li class="group/faq border-b">
	<label class="c-link-lazy block py-4">
		<span class="flex items-start justify-between">
			<span class="c-text-body-md font-medium">
				{#if isMessage(question)}
					<T message={question} />
				{:else}
					{@render question()}
				{/if}
			</span>
			<input type="checkbox" class="peer sr-only" />
			<i
				class="i i-[caret-down] block h-6 w-6 transition-transform
				duration-300 ease-out peer-checked:rotate-180 peer-checked:duration-100 peer-checked:ease-in"
			></i>
		</span>
	</label>
	<div
		class="group-has-checked/faq:grid-rows-[1fr] group-has-checked/faq:duration-100 group-has-checked:ease-in grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out"
	>
		<div class="overflow-hidden">
			<p class="tb:mx-6 mx-2 px-2 pb-4">
				{#if isMessage(answer)}
					<T message={answer} />
				{:else}
					{@render answer()}
				{/if}
			</p>
		</div>
	</div>
</li>
