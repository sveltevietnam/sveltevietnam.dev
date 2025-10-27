<script lang="ts" module>
	import { T } from '@sveltevietnam/i18n-new';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface TasksRowProps extends HTMLAttributes<HTMLTableRowElement> {
		progress: 'planned' | 'inprogress' | 'completed' | 'delayed';
	}
</script>

<script lang="ts">
	let { children, progress }: TasksRowProps = $props();

	const statusToSettings = {
		planned: {
			tKey: 'pages.roadmap.progress.planned',
			textClass: 'text-on-surface-subtle',
			iconClass: 'i-[ph--clock]',
		},
		inprogress: {
			tKey: 'pages.roadmap.progress.inprogress',
			textClass: 'text-info-on-surface',
			iconClass: 'i-[ph--hourglass]',
		},
		completed: {
			tKey: 'pages.roadmap.progress.completed',
			textClass: 'text-success-on-surface',
			iconClass: 'i-[ph--check]',
		},
		delayed: {
			tKey: 'pages.roadmap.progress.delayed',
			textClass: 'text-error-on-surface',
			iconClass: 'i-[ph--x]',
		},
	} as const;
</script>

<tr class="*:border *:px-3 *:py-2">
	<td>{@render children?.()} </td>
	<td class={['tablet:w-44 w-24', statusToSettings[progress].textClass]}>
		<span class="inline-flex items-center gap-2">
			<i class={['i mobile:hidden h-6 w-6', statusToSettings[progress].iconClass]}></i>
			<T key={statusToSettings[progress].tKey} />
		</span>
	</td>
</tr>
