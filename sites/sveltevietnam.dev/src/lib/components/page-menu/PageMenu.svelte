<script lang="ts">
	import { clickoutside } from '@svelte-put/clickoutside';
	import { T } from '@sveltevietnam/i18n';
	import type { HTMLAttributes } from 'svelte/elements';

	import * as m from '$data/locales/generated/messages';
	import { RoutingContext } from '$lib/routing/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	let {
		flat = false,
		class: cls,
		onnavigate = () => {},
		...rest
	}: {
		flat?: boolean;
		onnavigate?: () => void;
	} & HTMLAttributes<HTMLElement> = $props();

	const routing = RoutingContext.get();
	const settings = SettingsContext.get();

	let open = $state(false);

	const links = [
		{
			icon: 'i-[ph--house]',
			key: 'home' as const,
		},
		{
			icon: 'i-[ph--calendar-dots]',
			key: 'events' as const,
		},
		{
			icon: 'i-[ph--book-open]',
			key: 'blog' as const,
		},
		{
			icon: 'i-[ph--read-cv-logo]',
			key: 'jobs' as const,
		},
		{
			icon: 'i-[ph--lightbulb]',
			key: 'sponsor' as const,
		},
		{
			icon: 'i-[ph--users-three]',
			key: 'people' as const,
		},
		{
			icon: 'i-[ph--gear]',
			key: 'settings' as const,
		},
	];

	function onClickPageLink() {
		open = false;
		onnavigate();
	}
</script>

<nav
	class={['relative', !flat && 'w-fit', cls]}
	aria-label={m['components.page_menu.aria'](settings.language)}
	data-sveltekit-noscroll
	data-sveltekit-preload-data="hover"
	use:clickoutside={{ enabled: open }}
	onclickoutside={() => (open = false)}
	{...rest}
>
	{#if !flat}
		<label class="c-link-lazy flex cursor-pointer items-center gap-2 p-2 transition-colors">
			<input class="peer sr-only" type="checkbox" name="page-menu" bind:checked={open} />
			<i class="i i-[ph--compass] h-6 w-6"></i>
			<span class="sr-only peer-checked:hidden"><T message={m.open} /></span>
			<span class="sr-only hidden peer-checked:block"><T message={m.close} /></span>
			<span class="sr-only"><T message={m['components.page_menu.toggle']} /></span>
			<i class="i i-[ph--caret-down] h-5 w-5 transition-transform peer-checked:-rotate-180"></i>
		</label>
	{/if}
	<div
		class={['_menu bg-surface absolute right-0 top-full mt-1.5 w-max', flat ? 'contents' : 'grid']}
		inert={settings.hydrated && !flat && !open}
	>
		<div class="overflow-hidden">
			<ul class={[!flat && 'border-outline divide-outline divide-y border']}>
				{#each links as { key, icon } (key)}
					{@const path = routing.path(key)}
					{@const name = routing.name(key)}
					{@const current = routing.is(key)}
					<li class={[flat && 'border-b']}>
						<a
							class={[
								'current:text-primary current:font-bold hover:bg-primary-surface flex items-center gap-4',
								flat ? 'py-4' : 'px-4 py-2',
							]}
							href={path}
							aria-current={current}
							onclick={onClickPageLink}
						>
							<i class="i {icon} h-6 w-6"></i>
							{name}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</nav>

<style lang="postcss">
	label {
		&:has(input:checked) {
			color: var(--color-link);
		}
	}

	._menu {
		grid-template-rows: 0fr;
		transition: grid-template-rows 150ms var(--default-transition-timing-function);

		nav:has(input:checked) & {
			grid-template-rows: 1fr;
		}
	}
</style>
