<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import { SettingsContext } from '$lib/settings/context.svelte';

	let { crumbs, ...rest }: { crumbs: App.Route[] } & HTMLAttributes<HTMLElement> = $props();

	const settings = SettingsContext.get();
</script>

<nav
	aria-label={settings.language === 'vi' ? 'phân cấp trang' : 'breadcrumbs'}
	{...rest}
>
	<ul class="flex items-center gap-2">
		{#each crumbs as { name, path }, i}
			{@const current = i === crumbs.length - 1}
			<li class="contents">
				<a class={[!current && 'c-link-lazy']} aria-current={current} href={path}>
					{#if i === 0}
						<i class="i i-[house-line] h-6 w-6"></i>
					{:else}
						<span>{name}</span>
					{/if}
				</a>
				{#if !current}
					<i class="i i-[caret-right] h-4 w-4"></i>
				{/if}
			</li>
		{/each}
	</ul>
</nav>
