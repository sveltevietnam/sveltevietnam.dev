<script lang="ts">
	import type { StackItem } from '@svelte-put/async-stack';
	import { shortcut, type ShortcutEventDetail } from '@svelte-put/shortcut';
	import { T } from '@sveltevietnam/i18n';
	import {
		LanguageMenu,
		type LanguageMenuProps,
		ColorSchemeMenu,
		type ColorSchemeMenuProps,
		SocialLinks,
	} from '@sveltevietnam/kit/components';
	import {
		ColorSchemeContext,
		DialogContext,
		LockScrollContext,
		RoutingContext,
	} from '@sveltevietnam/kit/contexts';
	import { ScrollToggler } from '@sveltevietnam/kit/utilities';
	import type { HTMLAttributes } from 'svelte/elements';

	import * as p from '$data/routes/generated';
	import { PageMenu } from '$lib/components/page-menu';
	import { SearchDialog } from '$lib/dialogs/search-dialog';
	import { SettingsContext } from '$lib/settings/context.svelte';

	const isPrideMonth = new Date().getMonth() === 5; // June is Pride Month

	const routing = RoutingContext.get();
	const colorScheme = ColorSchemeContext.get();
	const dialogs = DialogContext.get();
	const lockscroll = LockScrollContext.get();
	const settings = SettingsContext.get();

	let { class: cls, ...rest }: HTMLAttributes<HTMLElement> = $props();

	const scrollToggler = new ScrollToggler();

	let isColorSchemeMenuOpen = $state(false);
	let isPageMenuOpen = $derived(false);
	let isLanguageMenuOpen = $state(false);
	let isMobileMenuOpen = $state(false);
	$effect(() => {
		if (scrollToggler.hidden) {
			isColorSchemeMenuOpen = false;
			isPageMenuOpen = false;
			isLanguageMenuOpen = false;
		}
	});
	$effect(() => {
		if (settings.screen === 'desktop') {
			isMobileMenuOpen = false;
		}
	});
	$effect(() => {
		lockscroll.toggle(isMobileMenuOpen);
	});

	let toolbarBackdropOpacity = $derived(scrollToggler.minScrollProgress);

	const linkToHome = $derived(p['/:lang']({ lang: routing.lang }));

	let pushed: StackItem<typeof SearchDialog> | null = $state(null);
	function handleSearch(e: MouseEvent | ShortcutEventDetail) {
		if ('originalEvent' in e) {
			e.originalEvent.preventDefault();
		} else {
			e.preventDefault();
		}
		if (!pushed) {
			pushed = dialogs.push('custom', { component: SearchDialog });
			pushed.resolution.then(() => {
				pushed = null;
			});
		}
	}

	const languageMenuProps: LanguageMenuProps = $derived({
		routing: {
			vi: routing.paths.vi,
			en: routing.paths.en,
		},
		hydrated: !!settings.hydrated,
		lang: routing.lang,
	});

	const colorSchemeMenuProps: ColorSchemeMenuProps = $derived({
		hydrated: !!settings.hydrated,
		colorScheme: colorScheme.user,
		onselect: (scheme) => (colorScheme.user = scheme),
	});
</script>

<svelte:window
	use:shortcut={{
		trigger: { key: 'k', modifier: ['ctrl', 'meta'], callback: handleSearch },
	}}
/>

<header
	class={[
		'z-header fixed w-full transition-transform',
		scrollToggler.hidden && '-translate-y-full',
		cls,
	]}
	{@attach scrollToggler.attachment}
	{...rest}
>
	<!-- non-mobile header -->
	<div class="max-w-pad mobile:hidden flex items-start justify-between">
		<svelte:element
			this={routing.is(linkToHome) ? 'div' : 'a'}
			class="
			bg-on-surface text-surface flex w-fit -translate-y-2 items-center gap-2 px-4 pt-6
			pb-4 transition-transform duration-500 hover:translate-y-0 hover:duration-100
			"
			{...routing.is(linkToHome)
				? {}
				: {
						href: linkToHome,
						'data-umami-event': 'click-header-logo',
						'data-umami-event-month': new Date().getMonth() + 1,
					}}
		>
			{#if routing.is(linkToHome)}
				<svg
					class={['h-15 w-15', isPrideMonth && 'pride']}
					inline-src="sveltevietnam"
					id="header-logo"
				></svg>
				{#if isPrideMonth}
					<svg class="h-0 w-0" inline-src="sveltevietnam-pride-gradients"></svg>
				{/if}
			{:else}
				<i class={['i i-sveltevietnam h-15 w-15', isPrideMonth && 'pride']}></i>
			{/if}
			<span class="c-text-title-sm max-w-25 uppercase">
				<T key="svelte_vietnam.name" />
			</span>
			<span class="sr-only">(<T key="components.header.go_to_home_page" />)</span>
		</svelte:element>
		<div class="relative flex w-fit items-center gap-5 border-x border-b px-6 py-5">
			<div class="bg-surface absolute inset-0 -z-1" style:opacity={toolbarBackdropOpacity}>
				<!-- backdrop -->
			</div>
			<button
				class="c-btn c-btn--outlined c-text-body-sm shrink-0 bg-transparent"
				onclick={handleSearch}
				type="button"
			>
				<i class="i i-[ph--magnifying-glass] h-5 w-5"></i>
				<span><T key="search" /></span>
				<span class="c-text-body-xs">
					{#if settings.platform === 'apple'}
						<kbd>⌘</kbd>
					{:else}
						<kbd>Ctrl</kbd>
					{/if}
					<kbd>K</kbd>
				</span>
			</button>
			<ColorSchemeMenu {...colorSchemeMenuProps} bind:open={isColorSchemeMenuOpen} />
			<LanguageMenu {...languageMenuProps} bind:open={isLanguageMenuOpen} />
			<PageMenu bind:open={isPageMenuOpen} />
		</div>
	</div>

	<!-- mobile header -->
	<div class="max-w-pad tablet:hidden bg-surface flex items-center gap-2 border-b py-2">
		<a class="mr-auto flex items-center gap-2" href={linkToHome}>
			<i class={['i i-sveltevietnam h-10 w-10', isPrideMonth && 'pride']}></i>
			<span class="font-lora max-w-18 text-sm leading-tight font-medium uppercase">
				<T key="svelte_vietnam.name" />
			</span>
			<span class="sr-only">(<T key="components.header.go_to_home_page" />)</span>
		</a>
		<button class="p-2" onclick={handleSearch} type="button">
			<i class="i i-[ph--magnifying-glass] h-6 w-6"></i>
			<span class="sr-only">
				<T key="search" />
			</span>
		</button>
		<label class="c-link-lazy flex cursor-pointer p-2">
			<input
				class="_mobile-menu-toggler peer sr-only"
				type="checkbox"
				name="mobile-menu"
				bind:checked={isMobileMenuOpen}
			/>
			<i class="i i-[ph--list] h-6 w-6 peer-checked:hidden"></i>
			<i class="i i-[ph--x] hidden h-6 w-6 peer-checked:block"></i>
			<span class="sr-only peer-checked:hidden"><T key="open" /></span>
			<span class="sr-only hidden peer-checked:block"><T key="close" /></span>
			<span class="sr-only"><T key="components.header.mobile_menu" /></span>
		</label>

		<!-- mobile menu -->
		<div class="_mobile-menu-backdrop bg-surface absolute inset-x-0 top-full grid"></div>
		<div
			class="_mobile-menu bg-surface absolute inset-x-0 top-full grid"
			inert={settings.hydrated && !isMobileMenuOpen}
		>
			<div class="overflow-hidden">
				<div class="_mobile-menu-content max-w-pad overflow-auto border-b py-8">
					<div class="relative z-1 flex flex-wrap items-center justify-center gap-4">
						<ColorSchemeMenu {...colorSchemeMenuProps} class="border border-current p-2" />
						<LanguageMenu {...languageMenuProps} class="border border-current p-2" />
					</div>
					<PageMenu
						class="relative z-0 mx-auto mt-4 mb-8 max-w-100"
						flat
						onnavigate={() => (isMobileMenuOpen = false)}
					/>
					<SocialLinks class="relative z-0 justify-center" position="header" />
				</div>
			</div>
		</div>
	</div>
</header>

<style lang="postcss">
	._mobile-menu {
		grid-template-rows: 0fr;
		transition: grid-template-rows 150ms var(--default-transition-timing-function);

		header:has(._mobile-menu-toggler:checked) & {
			grid-template-rows: 1fr;
		}
	}

	._mobile-menu-content {
		max-height: calc(100dvh - var(--spacing-header));
	}

	._mobile-menu-backdrop {
		display: none;
		height: calc(100dvh - var(--spacing-header));

		header:has(._mobile-menu-toggler:checked) & {
			display: block;
		}
	}

	.pride {
		--color-pride-0: #e50000;
		--color-pride-1: #e68d00;
		--color-pride-2: #e6d600;
		--color-pride-3: #008100;
		--color-pride-4: #004cff;
		--color-pride-5: #760188;

		&:not(svg) {
			background-image: linear-gradient(
				to bottom,
				var(--color-pride-0) 0%,
				var(--color-pride-0) 16.6%,
				var(--color-pride-1) 16.6%,
				var(--color-pride-1) 33.2%,
				var(--color-pride-2) 33.2%,
				var(--color-pride-2) 49.8%,
				var(--color-pride-3) 49.8%,
				var(--color-pride-3) 66.4%,
				var(--color-pride-4) 66.4%,
				var(--color-pride-4) 83%,
				var(--color-pride-5) 83%,
				var(--color-pride-5) 100%
			);
		}

		&:is(svg) {
			& :global(.svelte) {
				fill: url('#gradientSvelte');
			}

			& :global(.hat) {
				fill: url('#gradientHat');
			}
		}
	}
</style>
