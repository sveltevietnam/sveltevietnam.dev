<script lang="ts">
	import '@sveltevietnam/css/layers';
	import { T } from '@sveltevietnam/i18n';
	import {
		LanguageMenu,
		type LanguageMenuProps,
		ColorSchemeMenu,
		type ColorSchemeMenuProps,
	} from '@sveltevietnam/kit/components';
	import { ColorSchemeContext, RoutingContext } from '@sveltevietnam/kit/contexts';
	import { ScrollToggler } from '@sveltevietnam/kit/utilities';
	import { setContext } from 'svelte';

	import { browser, version } from '$app/environment';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as m from '$data/locales/generated/messages';
	import {
		VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME,
		VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN,
	} from '$env/static/public';

	import '../../app.css';

	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	const colorScheme = ColorSchemeContext.set(() => ({
		cookieName: VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME,
		user: data.settings.colorScheme,
	}));
	const routing = RoutingContext.set(() => ({
		lang: data.settings.language,
		paths: page.data.routing?.paths ?? {
			en: page.url.pathname,
			vi: page.url.pathname,
		},
	}));

	// for @sveltevietnam/i18n T.svelte component
	setContext('t:lang', () => data.settings.language);

	let isColorSchemeMenuOpen = $state(false);
	let isLanguageMenuOpen = $state(false);

	const scrollToggler = new ScrollToggler();
	let toolbarBackdropOpacity = $derived(scrollToggler.minScrollProgress);
	$effect(() => {
		if (scrollToggler.hidden) {
			isColorSchemeMenuOpen = false;
			isLanguageMenuOpen = false;
		}
	});

	const languageMenuProps: LanguageMenuProps = $derived({
		showLabel: 'non-mobile',
		i18n: {
			aria: m['language_menu.aria'],
			open: m.open,
			menu: m.menu,
			switchTo: m['language_menu.switch_to'],
			vietnamese: m['languages.vietnamese'],
			english: m['languages.english'],
		},
		routing: routing.paths,
		hydrated: !!browser,
		lang: data.settings.language,
	});

	const colorSchemeMenuProps: ColorSchemeMenuProps = $derived({
		showLabel: 'non-mobile',
		i18n: {
			aria: m['color_scheme_menu.aria'],
			open: m.open,
			light: m['color_scheme_menu.light'],
			dark: m['color_scheme_menu.dark'],
			system: m['color_scheme_menu.system'],
		},
		hydrated: !!browser,
		colorScheme: colorScheme.user,
		onselect: (scheme) => (colorScheme.user = scheme),
	});
</script>

<header
	class={[
		'max-w-pad z-header fixed flex w-full items-start justify-between transition-transform',
		scrollToggler.hidden && '-translate-y-full',
	]}
	{@attach scrollToggler.attachment}
>
	<a
		class="bg-on-surface text-surface flex w-fit -translate-y-2 items-center gap-2 px-4 pb-4 pt-6
		uppercase transition-transform duration-500 hover:translate-y-0 hover:duration-100"
		href={resolve('/')}
	>
		<i class="i i-sveltevietnam w-15 h-15"></i>
		<span class="">
			<span class="c-text-title-sm"><T message={m['svelte_vietnam.name']} /></span>
			<br />
			<span class="tracking-wide"> — <T message={m['app']} /> </span>
		</span>
	</a>
	<div class="relative flex w-fit items-center gap-5 border-x border-b px-6 py-5">
		<div class="-z-1 bg-surface absolute inset-0" style:opacity={toolbarBackdropOpacity}>
			<!-- backdrop -->
		</div>
		<ColorSchemeMenu {...colorSchemeMenuProps} bind:open={isColorSchemeMenuOpen} />
		<LanguageMenu {...languageMenuProps} bind:open={isLanguageMenuOpen} />
	</div>
</header>

{@render children()}

<footer
	class="max-w-pad c-text-body-xs mobile:flex-col border-outline flex items-center gap-4 border-t py-4"
>
	<p class="tablet:flex-1"><T message={m['footer.version']} /> {version}</p>
	<p>{new Date().getFullYear()} © <T message={m['svelte_vietnam.name']} /></p>
	<div class="tablet:flex-1">
		<a
			class="c-link-lazy tablet:justify-end flex items-center gap-2"
			href={VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN}
		>
			<i class="i i-[ph--arrow-left] h-5 w-5"></i>
			<T message={m['footer.back_to_svelte_vietnam']} />
		</a>
	</div>
</footer>
