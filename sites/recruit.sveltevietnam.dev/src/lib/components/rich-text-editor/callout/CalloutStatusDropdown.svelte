<script lang="ts" module>
	import { type Message, T } from '@sveltevietnam/i18n/runtime';
	import { Dropdown } from '@sveltevietnam/kit/components';
	import type { Status } from '@sveltevietnam/kit/constants';

	import * as m from '$data/locales/generated/messages';

	export interface CalloutStatusDropdownProps {
		status: Status;
		/** @bindale */
		open?: boolean;
		onselect?: (status: Status) => void;
	}
</script>

<script lang="ts">
	let { open = $bindable(false), status, onselect }: CalloutStatusDropdownProps = $props();

	const OPTIONS: Record<
		Status,
		{
			iconClass: string;
			label: Message<'string', never>;
		}
	> = {
		info: {
			iconClass: 'i-[ph--info]',
			label: m['components.rich_text_editor.toolbar.block.callout.status.info'],
		},
		warning: {
			iconClass: 'i-[ph--warning]',
			label: m['components.rich_text_editor.toolbar.block.callout.status.warning'],
		},
		success: {
			iconClass: 'i-[ph--check-circle]',
			label: m['components.rich_text_editor.toolbar.block.callout.status.success'],
		},
		error: {
			iconClass: 'i-[ph--warning-octagon]',
			label: m['components.rich_text_editor.toolbar.block.callout.status.error'],
		},
	};

	function handleSelect(status: Status) {
		onselect?.(status);
		open = false;
	}
</script>

<Dropdown class="group w-fit" direction="up" align="left" bind:open>
	{#snippet label()}
		{@const currentStatus = OPTIONS[status]}
		<span class="c-link-lazy flex items-center gap-2 px-2 py-1 transition-colors">
			<i class="i {currentStatus.iconClass} h-5 w-5"></i>
			<span class="sr-only">
				<T message={m['components.rich_text_editor.toolbar.block.callout.status.name']} />
			</span>
			<span class="" aria-hidden="true">
				<T message={currentStatus.label} />
			</span>
			<i class="i i-[ph--caret-down] h-5 w-5 transition-transform group-open:-rotate-180"></i>
		</span>
	{/snippet}
	{#snippet content()}
		<ul class="border-outline divide-outline bg-surface mb-1 w-max divide-y border">
			{#each Object.entries(OPTIONS) as [status, { iconClass, label }] (status)}
				<li>
					<button
						class="current:text-primary current:font-bold hover:bg-primary-surface flex w-full cursor-pointer
								items-center gap-4 px-4 py-2 -outline-offset-1"
						type="button"
						onclick={handleSelect.bind(null, status as Status)}
					>
						<i class="i {iconClass} h-5 w-5"></i>
						<span>
							<T message={label} />
						</span>
					</button>
				</li>
			{/each}
		</ul>
	{/snippet}
</Dropdown>
