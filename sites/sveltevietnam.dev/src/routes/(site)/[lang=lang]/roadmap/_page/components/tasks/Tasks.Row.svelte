<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	export interface TasksRowProps extends HTMLAttributes<HTMLTableRowElement> {
		progress: 'planned' | 'inprogress' | 'completed' | 'delayed';
	}
</script>

<script lang="ts">
	import { T } from '@sveltevietnam/i18n/runtime';

	import * as m from '$data/locales/generated/messages';

	let {
		children,
		progress,
	}: TasksRowProps = $props();

	const statusToSettings = {
		planned: {
			message: m['pages.roadmap.progress.planned'],
			textClass: 'text-on-surface-subtle',
			iconClass: 'i-[ph--clock]',
		},
		inprogress: {
			message: m['pages.roadmap.progress.inprogress'],
			textClass: 'text-info-on-surface',
			iconClass: 'i-[ph--hourglass]',
		},
		completed: {
			message: m['pages.roadmap.progress.completed'],
			textClass: 'text-success-on-surface',
			iconClass: 'i-[ph--check]',
		},
		delayed: {
			message: m['pages.roadmap.progress.delayed'],
			textClass: 'text-error-on-surface',
			iconClass: 'i-[ph--x]',
		},
	} as const;
</script>

<tr class="*:border *:px-3 *:py-2">
	<td>{@render children?.()} </td>
	<td class={['tablet:w-44 w-24', statusToSettings[progress].textClass]}>
		<span class="inline-flex items-center gap-2">
			<i class={["i h-6 w-6 mobile:hidden", statusToSettings[progress].iconClass]}></i>
			<T message={statusToSettings[progress].message} />
		</span>
	</td>
</tr>
