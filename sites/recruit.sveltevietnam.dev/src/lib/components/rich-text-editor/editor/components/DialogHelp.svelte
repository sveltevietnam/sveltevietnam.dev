<script lang="ts">
	import type { StackItemProps } from '@svelte-put/async-stack';
	import { enhanceDialog } from '@svelte-put/async-stack/helpers';
	import { T } from '@sveltevietnam/i18n/runtime';

	import * as m from '$data/locales/generated/messages';

	let { item }: StackItemProps<void> = $props();
</script>

<dialog class="c-dialog" {...enhanceDialog(item, { delayResolution: 'animationend' })}>
	<form method="dialog">
		<button class="c-link-lazy absolute right-4 top-4 p-2" formmethod="dialog">
			<span class="sr-only">
				<T message={m['close']} />
			</span>
			<i class="i i-[ph--x] h-6 w-6"></i>
		</button>
	</form>
	<div class="prose p-4">
		<h2 class="border-b border-outline"><T message={m['components.rich_text_editor.help.heading']} /></h2>
		<p>
			<T message={m['components.rich_text_editor.help.desc']} />
		</p>
	</div>
</dialog>
