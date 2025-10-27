<script lang="ts" module>
	import { T } from '@sveltevietnam/i18n-new';
	import type { Key } from '@sveltevietnam/i18n-new/generated';
	import type { Snippet } from 'svelte';

	import { Tasks } from '../tasks';
	import type { TasksRowProps } from '../tasks';

	export interface MilestoneProps {
		id: string;
		current?: boolean;
		name: string;
		objective?: Key;
		highlights?: Key[];
		tasks: {
			tKey: Key;
			progress: TasksRowProps['progress'];
		}[];
		children?: Snippet<[]>;
	}
</script>

<script lang="ts">
	let {
		id,
		current = false,
		name,
		objective,
		highlights,
		tasks,
		children,
	}: MilestoneProps = $props();
</script>

<section class="max-w-pad relative space-y-10">
	<h2 class="c-text-heading-lg border-b" {id}>
		<span class="tracking-tight">
			<T key="pages.roadmap.common.milestone" />:
		</span>
		{name}
		{#if current}
			(<T key="current" />)
		{/if}
	</h2>

	{#if objective}
		<section
			class="border-onehalf bg-surface shadow-brutal max-w-readable-relaxed border-current px-6 py-4
			leading-relaxed"
		>
			<h3 class="inline"><strong><T key="pages.roadmap.common.objective" /></strong>:</h3>
			<p class="inline"><T key={objective} /></p>
		</section>
	{/if}

	{#if highlights}
		<section class="space-y-4">
			<h3 class="c-text-body-md font-bold"><T key="pages.roadmap.common.highlight" />:</h3>
			<ul class="space-y-2">
				{#each highlights as highlight, i (i)}
					<li class="flex items-start gap-2">
						<i class="i i-[ph--confetti] h-6 w-6"></i>
						<T key={highlight} />
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<section>
		<h3 class="sr-only">
			<T key="pages.roadmap.common.task" />
		</h3>
		<Tasks.Table>
			{#each tasks as { tKey, progress }, i (i)}
				<Tasks.Row {progress}>
					<T key={tKey} />
				</Tasks.Row>
			{/each}
		</Tasks.Table>
	</section>

	{@render children?.()}
</section>
