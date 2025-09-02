<script lang="ts">
	import '@sveltevietnam/css/layers';
	import { T } from '@sveltevietnam/i18n';
	import fallback1x1 from '@sveltevietnam/kit/assets/images/fallbacks/1x1.jpg?enhanced&w=w=224;112&imagetools';
	import {
		LanguageMenu,
		type LanguageMenuProps,
		ColorSchemeMenu,
		type ColorSchemeMenuProps,
		Dropdown,
	} from '@sveltevietnam/kit/components';
	import { Contexts, ContextsProvider } from '@sveltevietnam/kit/contexts';
	import { ScrollToggler } from '@sveltevietnam/kit/utilities';

	import { browser, version } from '$app/environment';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import {
		VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME,
		VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN,
	} from '$env/static/public';

	import '../../app.css';

	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	const contexts = Contexts.set({
		routing: () => ({
			lang: data.settings.language,
			paths: page.data.routing?.paths ?? {
				en: page.url.pathname,
				vi: page.url.pathname,
			},
		}),
		colorScheme: () => ({
			cookieName: VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME,
			user: data.settings.colorScheme,
		}),
	});
	const { routing, colorScheme } = contexts;

	let isColorSchemeMenuOpen = $state(false);
	let isLanguageMenuOpen = $state(false);
	let isAccountMenuOpen = $state(false);

	const scrollToggler = new ScrollToggler();
	let toolbarBackdropOpacity = $derived(scrollToggler.minScrollProgress);
	$effect(() => {
		if (scrollToggler.hidden) {
			isColorSchemeMenuOpen = false;
			isLanguageMenuOpen = false;
			isAccountMenuOpen = false;
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

	let avatarUrl = $derived(fallback1x1); // TODO: load from page data
	const accountMenuItemClasses =
		'hover:bg-primary-surface flex cursor-pointer items-center gap-4 px-4 py-2 -outline-offset-1';
</script>

<ContextsProvider {contexts}>
	<header
		class={[
			'max-w-pad z-header fixed flex w-full items-start justify-between transition-transform',
			'max-tablet:py-2 max-tablet:border-b max-tablet:border-outline max-tablet:items-center',
			scrollToggler.hidden && '-translate-y-full',
		]}
		{@attach scrollToggler.attachment}
	>
		<a
			class={[
				'tablet:bg-on-surface tablet:text-surface tablet:-translate-y-2 tablet:px-4 tablet:pb-4 tablet:pt-6 ',
				'flex w-fit items-center gap-2 uppercase transition-transform duration-500 hover:translate-y-0 hover:duration-100',
			]}
			href={resolve('/')}
		>
			<i class="i i-sveltevietnam tablet:w-15 tablet:h-15 h-10 w-10"></i>
			<span class="leading-4">
				<span class="font-lora max-tablet:whitespace-nowrap c-text-body-sm tablet:c-text-title-sm"
					><T message={m['svelte_vietnam.name']} /></span
				>
				<br />
				<span class="c-text-body-xs tablet:c-text-body tracking-wide">
					— <T message={m['app']} />
				</span>
			</span>
		</a>
		<div
			class="tablet:gap-5 tablet:border-x tablet:border-b tablet:px-6 tablet:py-5 relative flex w-fit items-center gap-2"
		>
			<div
				class="toolbar-backdrop -z-1 bg-surface opacity-(--toolbar-backdrop-opacity) absolute
				inset-0"
				style:--toolbar-backdrop-opacity={toolbarBackdropOpacity}
			>
				<!-- backdrop -->
			</div>

			<ColorSchemeMenu {...colorSchemeMenuProps} bind:open={isColorSchemeMenuOpen} />
			<LanguageMenu {...languageMenuProps} bind:open={isLanguageMenuOpen} />

			<Dropdown bind:open={isAccountMenuOpen}>
				{#snippet label()}
					<span class="sr-only">Manage your account</span>
					<enhanced:img
						class="aspect-square h-8 w-auto overflow-hidden rounded-full"
						src={avatarUrl}
						alt=""
					/>
				{/snippet}

				{#snippet content()}
					<ul class="border-outline divide-outline bg-surface mt-0.5 w-max divide-y border">
						<li>
							<a class={accountMenuItemClasses} href={p['/:lang/profile']({ lang: routing.lang })}>
								<i class="i i-[ph--user] h-6 w-6"></i>
								<span>Profile</span>
							</a>
						</li>
						<li>
							<form
								class="contents"
								action="{p['/:lang/login']({ lang: routing.lang })}?/logout"
								method="POST"
								use:enhance
							>
								<button class={accountMenuItemClasses} type="submit">
									<i class="i i-[ph--sign-out] h-6 w-6"></i>
									<span>Logout</span>
								</button>
							</form>
						</li>
					</ul>
				{/snippet}
			</Dropdown>
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
</ContextsProvider>
