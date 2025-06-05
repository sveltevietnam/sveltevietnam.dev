<script lang="ts">
	import type { StackItem } from '@svelte-put/async-stack';
	import { shortcut, type ShortcutEventDetail } from '@svelte-put/shortcut';
	import { T } from '@sveltevietnam/i18n';
	import type { HTMLAttributes } from 'svelte/elements';

	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import { ColorSchemeMenu } from '$lib/components/color-scheme-menu';
	import { LanguageMenu } from '$lib/components/language-menu';
	import { PageMenu } from '$lib/components/page-menu';
	import { SocialLinks } from '$lib/components/social-links';
	import { SearchDialog } from '$lib/dialogs/components/search-dialog';
	import { DialogContext } from '$lib/dialogs/context.svelte';
	import { RoutingContext } from '$lib/routing/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	const isPrideMonth = new Date().getMonth() === 5; // June is Pride Month

	const routing = RoutingContext.get();
	const settings = SettingsContext.get();
	const dialog = DialogContext.get();

	let { class: cls, ...rest }: HTMLAttributes<HTMLElement> = $props();

	let isColorSchemeMenuOpen = $state(false);
	let isPageMenuOpen = $state(false);
	let isLanguageMenuOpen = $state(false);
	let isMobileMenuOpen = $state(false);
	$effect(() => {
		if (settings.screen === 'desktop') {
			isMobileMenuOpen = false;
		}
	});
	$effect(() => {
		settings.toggleScrollLock(isMobileMenuOpen);
	});

	// on change scroll direction
	// and has travelled for at least SCROLL_Y_THRESHOLD
	// toggle the visibility of header
	const MINIMUM_SCROLL_Y = 400;
	const SCROLL_Y_DELTA_THRESHOLD = 100;
	let lastScrollY = $state(0);
	let lastDirection: 'up' | 'down' = 'down';
	let lastScrollYAtDirectionChange = 0;
	let shouldHideHeader = $state(false);

	function onScroll() {
		const { scrollY } = window;
		const direction = scrollY > lastScrollY ? 'down' : 'up';

		if (scrollY < MINIMUM_SCROLL_Y) {
			shouldHideHeader = false;
		} else if (direction !== lastDirection) {
			lastScrollYAtDirectionChange = scrollY;
		} else if (Math.abs(scrollY - lastScrollYAtDirectionChange) > SCROLL_Y_DELTA_THRESHOLD) {
			if (direction === 'up') {
				shouldHideHeader = false;
			} else {
				shouldHideHeader = true;
				isColorSchemeMenuOpen = isPageMenuOpen = isLanguageMenuOpen = false;
			}
		}

		lastScrollY = scrollY;
		lastDirection = direction;
	}

	let toolbarBackdropOpacity = $derived(
		!settings.hydrated ? 1 : Math.min((lastScrollY * 2) / MINIMUM_SCROLL_Y, 1),
	);

	const linkToHome = $derived(p['/:lang']({ lang: settings.language }));

	let pushed: StackItem | null = $state(null);
	function handleSearch(e: MouseEvent | ShortcutEventDetail) {
		if ('originalEvent' in e) {
			e.originalEvent.preventDefault();
		} else {
			e.preventDefault();
		}
		if (!pushed) {
			pushed = dialog.push('custom', { component: SearchDialog });
			pushed.resolution.then(() => {
				pushed = null;
			});
		}
	}
</script>

<svelte:window
	onscroll={onScroll}
	use:shortcut={{
		trigger: { key: 'k', modifier: ['ctrl', 'meta'], callback: handleSearch },
	}}
/>

<header
	class={[
		'z-header fixed w-full transition-transform',
		shouldHideHeader && '-translate-y-full',
		cls,
	]}
	{...rest}
>
	<!-- non-mobile header -->
	<div class="max-w-pad mobile:hidden flex items-start justify-between">
		<svelte:element
			this={routing.is(linkToHome) ? 'div' : 'a'}
			class="
			bg-on-surface text-surface flex w-fit -translate-y-2 items-center gap-2 px-4 pb-4
			pt-6 transition-transform duration-500 hover:translate-y-0 hover:duration-100
			"
			{...routing.is(linkToHome) ? {} : { href: linkToHome }}
		>
			{#if routing.is(linkToHome)}
				<svg
					class={['w-15 h-15', isPrideMonth && 'pride']}
					inline-src="sveltevietnam"
					id="header-logo"
				></svg>
				{#if isPrideMonth}
					<svg class="h-0 w-0" inline-src="sveltevietnam-pride-gradients"></svg>
				{/if}
			{:else}
				<i class={['i i-sveltevietnam w-15 h-15', isPrideMonth && 'pride']}></i>
			{/if}
			<span class="c-text-title-sm max-w-25 uppercase">
				<T message={m['svelte_vietnam.name']} />
			</span>
			<span class="sr-only">(<T message={m['components.header.go_to_home_page']} />)</span>
		</svelte:element>
		<div class="relative flex w-fit items-center gap-5 border-x border-b px-6 py-5">
			<div class="-z-1 bg-surface absolute inset-0" style:opacity={toolbarBackdropOpacity}>
				<!-- backdrop -->
			</div>
			<button
				class="c-btn c-btn--outlined shrink-0 bg-transparent text-sm"
				onclick={handleSearch}
				type="button"
			>
				<i class="i i-[ph--magnifying-glass] h-5 w-5"></i>
				<span><T message={m.search} /></span>
				<span class="c-text-body-xs">
					{#if settings.platform === 'mac'}
						<kbd class="c-text-body-xs">⌘</kbd>
					{:else}
						<kbd class="c-text-body-xs">Ctrl</kbd>
					{/if}
					<kbd>K</kbd>
				</span>
			</button>
			<ColorSchemeMenu bind:open={isColorSchemeMenuOpen} />
			<LanguageMenu bind:open={isLanguageMenuOpen} />
			<PageMenu bind:open={isPageMenuOpen} />
		</div>
	</div>

	<!-- mobile header -->
	<div class="max-w-pad tablet:hidden bg-surface flex items-center gap-2 border-b py-2">
		<a class="mr-auto flex items-center gap-2" href={linkToHome}>
			<i class={['i i-sveltevietnam h-10 w-10', isPrideMonth && 'pride']}></i>
			<span class="font-lora max-w-18 text-sm font-medium uppercase leading-tight">
				<T message={m['svelte_vietnam.name']} />
			</span>
			<span class="sr-only">(<T message={m['components.header.go_to_home_page']} />)</span>
		</a>
		<button class="p-2" onclick={handleSearch} type="button">
			<i class="i i-[ph--magnifying-glass] h-6 w-6"></i>
			<span class="sr-only">
				<T message={m.search} />
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
			<span class="sr-only peer-checked:hidden"><T message={m.open} /></span>
			<span class="sr-only hidden peer-checked:block"><T message={m.close} /></span>
			<span class="sr-only"><T message={m['components.header.mobile_menu']} /></span>
		</label>

		<!-- mobile menu -->
		<div class="_mobile-menu-backdrop bg-surface absolute inset-x-0 top-full grid"></div>
		<div
			class="_mobile-menu bg-surface absolute inset-x-0 top-full grid"
			inert={settings.hydrated && !isMobileMenuOpen}
		>
			<div class="overflow-hidden">
				<div class="_mobile-menu-content max-w-pad overflow-auto border-b py-8">
					<div class="z-1 relative flex flex-wrap items-center justify-center gap-4">
						<ColorSchemeMenu class="border border-current" />
						<LanguageMenu class="border border-current" />
					</div>
					<PageMenu
						class="max-w-100 relative z-0 mx-auto mb-8 mt-4"
						flat
						onnavigate={() => (isMobileMenuOpen = false)}
					/>
					<SocialLinks class="relative z-0 justify-center" />
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
				fill: url("#gradientSvelte");
			}

			& :global(.hat) {
				fill: url("#gradientHat");
			}
		}
	}
</style>
