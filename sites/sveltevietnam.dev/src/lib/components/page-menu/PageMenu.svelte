<script lang="ts">
	import { clickoutside } from '@svelte-put/clickoutside';
	import { T } from '@sveltevietnam/i18n';
	import type { HTMLAttributes } from 'svelte/elements';

	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import * as n from '$data/routes/generated/names';
	import { RoutingContext } from '$lib/routing/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	let {
		flat = false,
		class: cls,
		onnavigate = () => {},
		open = $bindable(false),
		...rest
	}: {
		flat?: boolean;
		onnavigate?: () => void;
		open?: boolean;
	} & HTMLAttributes<HTMLElement> = $props();

	const routing = RoutingContext.get();
	const settings = SettingsContext.get();

	const links = [
		{
			icon: 'i-[ph--house]',
			path: p['/:lang']({ lang: settings.language }),
			name: n['/:lang'](settings.language),
		},
		{
			icon: 'i-[ph--calendar-dots]',
			path: p['/:lang/events']({ lang: settings.language }),
			name: n['/:lang/events'](settings.language),
		},
		{
			icon: 'i-[ph--book-open]',
			path: p['/:lang/blog']({ lang: settings.language }),
			name: n['/:lang/blog'](),
		},
		{
			icon: 'i-[ph--read-cv-logo]',
			path: p['/:lang/jobs']({ lang: settings.language }),
			name: n['/:lang/jobs'](settings.language),
		},
		{
			icon: 'i-[ph--lightbulb]',
			path: p['/:lang/sponsor']({ lang: settings.language }),
			name: n['/:lang/sponsor'](settings.language),
		},
		{
			icon: 'i-[ph--users-three]',
			path: p['/:lang/people']({ lang: settings.language }),
			name: n['/:lang/people'](settings.language),
		},
		{
			icon: 'i-[ph--gear]',
			path: p['/:lang/settings']({ lang: settings.language }),
			name: n['/:lang/settings'](settings.language),
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
		<label
			class="c-link-lazy flex cursor-pointer items-center gap-2 p-2 transition-colors"
			data-umami-event="toggle-page-menu"
			data-umami-event-open={open}
		>
			<input class="peer sr-only" type="checkbox" name="page-menu" bind:checked={open} />
			<i class="i i-[ph--compass] h-6 w-6"></i>
			<span class="sr-only">
				<T message={m.open} />
				<T message={m.menu} />
			</span>
			<i class="i i-[ph--caret-down] h-5 w-5 transition-transform peer-checked:-rotate-180"></i>
		</label>
	{/if}
	<div
		class={['_menu bg-surface absolute right-0 top-full mt-1.5 w-max', flat ? 'contents' : 'grid']}
		inert={settings.hydrated && !flat && !open}
	>
		<div class="overflow-hidden">
			<ul class={[!flat && 'border-outline divide-outline divide-y border']}>
				{#each links as { path, name, icon } (path)}
					{@const current = routing.is(path)}
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
