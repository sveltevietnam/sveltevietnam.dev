<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import * as n from '$data/routes/generated/names';
	import { ColorSchemeMenu } from '$lib/components/color-scheme-menu';
	import { LanguageMenu } from '$lib/components/language-menu';
	import { PageMenu } from '$lib/components/page-menu';
	import { SocialLinks } from '$lib/components/social-links';
	import { RoutingContext } from '$lib/routing/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	const routing = RoutingContext.get();
	const settings = SettingsContext.get();

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

	const MAX_SCROLL_Y = 400;
	let lastScrollY = $state(0);
	let shouldHideHeader = $state(false);
	function onScroll() {
		if (window.scrollY > lastScrollY && window.scrollY > MAX_SCROLL_Y) {
			shouldHideHeader = true;
			isColorSchemeMenuOpen = false;
			isPageMenuOpen = false;
			isLanguageMenuOpen = false;
		} else {
			shouldHideHeader = false;
		}
		lastScrollY = window.scrollY;
	}

	let toolbarBackdropOpacity = $derived(
		!settings.hydrated ? 1 : Math.min((lastScrollY * 2) / MAX_SCROLL_Y, 1),
	);

	const links = $derived({
		home: p['/:lang']({ lang: settings.language }),
		search: {
			path: p['/:lang/search']({ lang: settings.language }),
			name: n['/:lang/search'](settings.language),
		},
	});
</script>

<svelte:window onscroll={onScroll} />

<header
	class={['z-header fixed w-full transition-transform', shouldHideHeader && '-translate-y-full']}
>
	<!-- non-mobile header -->
	<div class="max-w-pad mobile:hidden flex items-start justify-between">
		<svelte:element
			this={routing.is(links.home) ? 'div' : 'a'}
			class="
			bg-on-surface text-surface flex w-fit -translate-y-2 items-center gap-2 px-4 pb-4
			pt-6 transition-transform duration-500 hover:translate-y-0 hover:duration-100
			"
			{...routing.is(links.home) ? {} : { href: links.home }}
		>
			{#if routing.is(links.home)}
				<svg class="w-15 h-15" inline-src="sveltevietnam" id="header-logo"></svg>
			{:else}
				<i class="i i-sveltevietnam w-15 h-15"></i>
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
			<form>
				<label class="c-text-input desktop:w-48 widescreen:w-60 w-40">
					<span class="sr-only"><T message={m.search} /></span>
					<i class="i i-[ph--magnifying-glass] h-6 w-6"></i>
					<input
						class="w-full"
						name="search"
						placeholder="{m.search(settings.language)}..."
					/>
				</label>
			</form>
			<ColorSchemeMenu bind:open={isColorSchemeMenuOpen} />
			<LanguageMenu bind:open={isLanguageMenuOpen} />
			<PageMenu bind:open={isPageMenuOpen} />
		</div>
	</div>

	<!-- mobile header -->
	<div class="max-w-pad tablet:hidden bg-surface flex items-center gap-2 border-b py-2">
		<a class="mr-auto flex items-center gap-2" href={links.home}>
			<i class="i i-sveltevietnam h-10 w-10"></i>
			<span class="font-lora max-w-18 text-sm font-medium uppercase leading-tight">
				<T message={m['svelte_vietnam.name']} />
			</span>
			<span class="sr-only">(<T message={m['components.header.go_to_home_page']} />)</span>
		</a>
		<a class="p-2" href={links.search.path}>
			<i class="i i-[ph--magnifying-glass] h-6 w-6"></i>
			<span class="sr-only">{links.search.name}</span>
		</a>
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
</style>
