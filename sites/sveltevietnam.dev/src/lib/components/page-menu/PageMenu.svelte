<script lang="ts">
	import { clickoutside } from '@svelte-put/clickoutside';
	import { T } from '@sveltevietnam/i18n-new';
	import { delocalizeUrl } from '@sveltevietnam/i18n-new/utils';
	import { LANGUAGES } from '@sveltevietnam/kit/constants';
	import { Contexts } from '@sveltevietnam/kit/contexts';
	import type { HTMLAttributes } from 'svelte/elements';

	import * as p from '$data/routes/generated';
	import * as n from '$data/routes/generated/names';
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

	const settings = SettingsContext.get();
	const { routing } = Contexts.get();

	const links = $derived([
		{
			icon: 'i-[ph--house]',
			path: p['/:lang']({ lang: routing.lang }),
			name: n['/:lang'](routing.lang),
		},
		{
			icon: 'i-[ph--calendar-dots]',
			path: p['/:lang/events']({ lang: routing.lang }),
			name: n['/:lang/events'](routing.lang),
		},
		{
			icon: 'i-[ph--book-open]',
			path: p['/:lang/blog']({ lang: routing.lang }),
			name: n['/:lang/blog'](),
		},
		{
			icon: 'i-[ph--read-cv-logo]',
			path: p['/:lang/jobs']({ lang: routing.lang }),
			name: n['/:lang/jobs'](routing.lang),
		},
		{
			icon: 'i-[ph--lightbulb]',
			path: p['/:lang/sponsor']({ lang: routing.lang }),
			name: n['/:lang/sponsor'](routing.lang),
		},
		{
			icon: 'i-[ph--users-three]',
			path: p['/:lang/people']({ lang: routing.lang }),
			name: n['/:lang/people'](routing.lang),
		},
		{
			icon: 'i-[ph--gear]',
			path: p['/:lang/settings']({ lang: routing.lang }),
			name: n['/:lang/settings'](routing.lang),
		},
	]);

	function onClickPageLink() {
		open = false;
		onnavigate();
	}
</script>

<nav
	class={['relative', !flat && 'w-fit', cls]}
	aria-labelledby="page-menu-label"
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
			<span class="sr-only" id="page-menu-label">
				<T key="components.page_menu.aria" />
			</span>
			<i class="i i-[ph--caret-down] h-5 w-5 transition-transform peer-checked:-rotate-180"></i>
		</label>
	{/if}
	<div
		class={['_menu bg-surface absolute top-full right-0 mt-1.5 w-max', flat ? 'contents' : 'grid']}
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
							data-umami-event="click-navigation-link"
							data-umami-event-position="page-menu"
							data-umami-event-path={delocalizeUrl(path, LANGUAGES)}
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
