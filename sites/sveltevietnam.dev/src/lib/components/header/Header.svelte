<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import { ColorSchemeMenu } from '$lib/components/color-scheme-menu';
	import { LanguageMenu } from '$lib/components/language-menu';
	import { PageMenu } from '$lib/components/page-menu';
	import { SocialLinks } from '$lib/components/social-links';
	import { RoutingContext } from '$lib/routing/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	const routing = RoutingContext.get();
	const settings = SettingsContext.get();

	let {
		locale,
		localeLanguageMenu,
		localeColorSchemeMenu,
		localePageMenu,
	}: {
		locale: import('./locales/generated').Locale;
		localeLanguageMenu: import('$lib/components/language-menu/locales/generated').Locale;
		localeColorSchemeMenu: import('$lib/components/color-scheme-menu/locales/generated').Locale;
		localePageMenu: import('$lib/components/page-menu/locales/generated').Locale;
	} = $props();

	let isMobileMenuOpen = $state(false);
	$effect(() => {
		if (settings.screen === 'desktop') {
			isMobileMenuOpen = false;
		}
	});

	const MAX_SCROLL_Y = 400;
	let lastScrollY = $state(0);
	let shouldHideHeader = $state(false);
	function onScroll() {
		if (window.scrollY > lastScrollY && window.scrollY > MAX_SCROLL_Y) {
			shouldHideHeader = true;
		} else {
			shouldHideHeader = false;
		}
		lastScrollY = window.scrollY;
	}

	let toolbarBackdropOpacity = $derived(!settings.hydrated ? 1 : Math.min(lastScrollY * 2 / MAX_SCROLL_Y, 1));
</script>

<svelte:window onscroll={onScroll} />

<header class={['z-header fixed w-full transition-transform', shouldHideHeader && '-translate-y-full']}>
	<!-- non-mobile header -->
	<div class="max-w-pad mobile:hidden flex items-start justify-between">
		<a
			class="
			bg-on-surface text-surface flex w-fit -translate-y-2 items-center gap-2 px-4 pb-4
			pt-6 transition-transform duration-500 hover:translate-y-0 hover:duration-100
			"
			href={routing.path('home')}
		>
			<i class="i i-sveltevietnam w-15 h-15"></i>
			<span class="c-text-title-sm max-w-25 uppercase">{locale.sveltevietnam}</span>
			<span class="sr-only">(<T message={locale.go_to_homepage} />)</span>
		</a>
		<div class="relative flex w-fit items-center gap-5 border-x border-b px-6 py-5">
			<div class="-z-1 absolute inset-0 bg-surface" style:opacity={toolbarBackdropOpacity}>
				<!-- backdrop -->
			</div>
			<form>
				<label class="c-text-input desktop:w-48 widescreen:w-60 w-40">
					<span class="sr-only"><T message={locale.search} /></span>
					<i class="i i-[magnifying-glass] h-6 w-6"></i>
					<input class="w-full" name="search" placeholder="{locale.search}..." />
				</label>
			</form>
			<ColorSchemeMenu locale={localeColorSchemeMenu} />
			<LanguageMenu locale={localeLanguageMenu} />
			<PageMenu locale={localePageMenu} />
		</div>
	</div>

	<!-- mobile header -->
	<div class="max-w-pad tablet:hidden bg-surface flex items-center gap-2 border-b py-2">
		<a class="mr-auto flex items-center gap-2" href={routing.path('home')}>
			<i class="i i-sveltevietnam h-10 w-10"></i>
			<span class="font-lora max-w-18 text-sm font-medium uppercase leading-tight"
				>{locale.sveltevietnam}</span
			>
			<span class="sr-only">(<T message={locale.go_to_homepage} />)</span>
		</a>
		<a class="p-2" href={routing.path('search')}>
			<i class="i i-[magnifying-glass] h-6 w-6"></i>
			<span class="sr-only">{routing.name('search')}</span>
		</a>
		<label class="cursor-pointer p-2 flex c-link-lazy">
			<input
				class="_mobile-menu-toggler peer sr-only"
				type="checkbox"
				name="mobile-menu"
				bind:checked={isMobileMenuOpen}
			/>
			<i class="i i-[list] h-6 w-6 peer-checked:hidden"></i>
			<i class="i i-[x] h-6 w-6 hidden peer-checked:block"></i>
			<span class="sr-only peer-checked:hidden"><T message={locale.open} /></span>
			<span class="sr-only hidden peer-checked:block"><T message={locale.close} /></span>
			<span class="sr-only"><T message={locale.mobile_menu} /></span>
		</label>

		<!-- mobile menu -->
		<div
			class="_mobile-menu bg-surface absolute inset-x-0 top-full grid"
			inert={settings.hydrated && !isMobileMenuOpen}
		>
			<div class="overflow-hidden">
				<div class="_mobile-menu-content max-w-pad space-y-10">
					<PageMenu
						class="mx-auto max-w-80"
						flat
						locale={localePageMenu}
						onnavigate={() => (isMobileMenuOpen = false)}
					/>
					<div class="flex flex-wrap items-center justify-center gap-4">
						<ColorSchemeMenu class="border border-current" locale={localeColorSchemeMenu} />
						<LanguageMenu class="border border-current" locale={localeLanguageMenu} />
					</div>
					<SocialLinks class="justify-center" />
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
		height: calc(100dvh - var(--header-height));
	}
</style>
