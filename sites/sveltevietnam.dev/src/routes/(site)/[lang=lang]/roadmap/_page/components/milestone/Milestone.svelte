<script lang="ts" module>
	import type { TasksRowProps } from '../tasks';

	export interface MilestoneProps {
		id: string;
		current?: boolean;
		name: string;
		objective?: Message<MessageType, never>;
		highlights?: Message<MessageType, never>[];
		tasks: {
			message: Message<MessageType, never>;
			progress: TasksRowProps['progress'];
		}[];
		children?: Snippet<[]>;
	}
</script>

<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { type Message, type MessageType } from '@sveltevietnam/i18n/runtime';
	import type { Snippet } from 'svelte';

	import * as m from '$data/locales/generated/messages';

	import { Tasks } from '../tasks';

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
			<T message={m['pages.roadmap.common.milestone']} />:
		</span>
		{name}
		{#if current}
			(<T message={m.current} />)
		{/if}
	</h2>

	{#if objective}
		<section
			class="border-onehalf bg-surface shadow-brutal max-w-readable-relaxed border-current px-6 py-4
			leading-relaxed"
		>
			<h3 class="inline"><strong><T message={m['pages.roadmap.common.objective']} /></strong>:</h3>
			<p class="inline"><T message={objective} /></p>
		</section>
	{/if}

	{#if highlights}
		<section class="space-y-4">
			<h3 class="c-text-body-md font-bold"><T message={m['pages.roadmap.common.highlight']} />:</h3>
			<ul class="space-y-2">
				{#each highlights as highlight, i (i)}
					<li class="flex items-start gap-2">
						<i class="i i-[ph--confetti] h-6 w-6"></i>
						<T message={highlight} />
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<section>
		<h3 class="sr-only">
			<T message={m['pages.roadmap.common.task']} />
		</h3>
		<Tasks.Table>
			{#each tasks as { message, progress }, i (i)}
				<Tasks.Row {progress}>
					<T {message} />
				</Tasks.Row>
			{/each}
		</Tasks.Table>
	</section>

	{@render children?.()}
</section>
