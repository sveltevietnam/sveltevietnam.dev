<script lang="ts" module>
	import type { StackItemProps } from '@svelte-put/async-stack';

	export interface ConfirmationDialogProps extends StackItemProps<"cancel" | "confirm"> {
		title: string;
		desc: string;
		cancel: string;
		confirm: string;
	}

</script>

<script lang="ts">
	import { enhanceDialog } from './dialog';

	let { item, title, desc, cancel, confirm }: ConfirmationDialogProps = $props();

	// this dialog is resolved by the dialog form (see enhanceDialog),
	// but you may also call item.resolve(...) to do it programmatically.
</script>

<dialog {...enhanceDialog(item)}>
	<form class="space-y-6" method="dialog">
		<button
			class="c-link-lazy absolute right-4 top-4 p-2"
			formmethod="dialog"
			value="cancel"
		>
			<span class="sr-only">Close</span>
			<i class="i i-[ph--x] h-6 w-6"></i>
		</button>

		<p class="c-text-title border-b">{title}</p>
		<p>{desc}</p>

		<div class="flex justify-end space-x-2">
			<button class="c-btn c-btn--outlined" formmethod="dialog" value="cancel">
				{cancel}
			</button>
			<button class="c-btn c-btn-primary" formmethod="dialog" value="confirm">
				{confirm}
			</button>
		</div>
	</form>
</dialog>
