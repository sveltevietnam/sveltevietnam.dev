<script lang="ts" module>
	import { T } from '@sveltevietnam/i18n-new';
	import type { Key } from '@sveltevietnam/i18n-new/generated';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export interface ToolbarIconButtonProps extends HTMLButtonAttributes {
		iconClass: string;
		label: Key;
		active?: boolean;
	}
</script>

<script lang="ts">
	let { iconClass, label, active = false, class: cls, ...rest }: ToolbarIconButtonProps = $props();
</script>

<button class={['c-btn c-btn--icon p-2', active && 'bg-primary/50', cls]} type="button" {...rest}>
	<i class="i {iconClass} h-5 w-5"></i>
	<span class="sr-only">
		<T key={label} />
	</span>
</button>
