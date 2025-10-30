<script lang="ts">
	import type { StackItemProps } from '@svelte-put/async-stack';
	import { enhanceDialog } from '@svelte-put/async-stack/helpers';
	import { T } from '@sveltevietnam/i18n';
	import { EMAILS } from '@sveltevietnam/kit/constants';

	let { item }: StackItemProps<void> = $props();
</script>

<dialog class="c-dialog" {...enhanceDialog(item, { delayResolution: 'animationend' })}>
	<form method="dialog">
		<button class="c-link-lazy absolute top-4 right-4 p-2" formmethod="dialog">
			<span class="sr-only">
				<T key="close" />
			</span>
			<i class="i i-[ph--x] h-6 w-6"></i>
		</button>
	</form>
	<div class="prose p-4">
		<h2 class="border-outline border-b">
			<T key="components.rich_text_editor.help.heading" />
		</h2>
		<p>
			<T key="components.rich_text_editor.help.desc" params={{ mail: EMAILS.JOBS }} />
		</p>
	</div>
</dialog>
