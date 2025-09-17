<script lang="ts">
	import { enhanceDialog } from '@svelte-put/async-stack/helpers';

	import { Contentful } from '../../components/contentful';

	import type { DialogConfirmationProps } from '.';

	let { item, title, description, confirm, cancel }: DialogConfirmationProps = $props();
</script>

<dialog
	class="c-dialog"
	{...enhanceDialog(item, { defaultReturnValue: 'cancel', delayResolution: 'animationend' })}
>
	<form class="space-y-6" method="dialog">
		<button class="c-link-lazy absolute right-4 top-4 p-2" formmethod="dialog">
			<span class="sr-only">Close</span>
			<i class="i i-[ph--x] h-6 w-6"></i>
		</button>

		{#if title}
			<Contentful prop={title} tag="p" class="c-text-title border-outline border-b" />
		{/if}

		{#if description}
			<Contentful prop={description} tag="p" />
		{/if}

		<div class="flex flex-wrap justify-end gap-4">
			{#if cancel}
				<Contentful prop={cancel} tag="button" class="c-btn c-btn--outlined" formmethod="dialog" />
			{/if}

			{#if confirm}
				<Contentful prop={confirm} tag="button" class="c-btn" formmethod="dialog" value="confirm" />
			{/if}
		</div>
	</form>
</dialog>
