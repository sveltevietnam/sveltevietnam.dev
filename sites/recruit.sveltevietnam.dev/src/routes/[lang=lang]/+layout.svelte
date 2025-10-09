<script lang="ts">
	import { T } from '@sveltevietnam/i18n/runtime';
	import {
		PageMetadata,
		LanguageMenu,
		type LanguageMenuProps,
		ColorSchemeMenu,
		type ColorSchemeMenuProps,
		Footer,
	} from '@sveltevietnam/kit/components';
	import { EMAILS } from '@sveltevietnam/kit/constants';
	import { Contexts, ContextsProvider } from '@sveltevietnam/kit/contexts';
	import { ScrollToggler } from '@sveltevietnam/kit/utilities';
	import { onMount } from 'svelte';

	import { browser, version } from '$app/environment';
	import { page } from '$app/state';
	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import * as n from '$data/routes/generated/names';
	import {
		VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME,
		VITE_PUBLIC_ORIGIN,
		VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN,
		VITE_PUBLIC_UMAMI,
		VITE_PUBLIC_UMAMI_SCRIPT_URL,
		VITE_PUBLIC_UMAMI_WEBSITE_ID,
	} from '$env/static/public';
	import { AccountMenu } from '$lib/components/account-menu';

	import '../../app.css';

	import type { LayoutProps } from './$types';
	import ogImageEn from './_local/images/og.en.jpg?url';
	import ogImageVi from './_local/images/og.vi.jpg?url';

	const ogImage = {
		en: ogImageEn,
		vi: ogImageVi,
	};

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

	let navigationPrimary = $derived([
		{
			path: p['/:lang']({ lang: routing.lang }),
			name: n['/:lang'](routing.lang),
		},
		...(data.user
			? [
					{
						path: p['/:lang/profile']({ lang: routing.lang }),
						name: n['/:lang/profile'](routing.lang),
					},
					{
						path: p['/:lang/postings']({ lang: routing.lang }),
						name: n['/:lang/postings'](routing.lang),
					},
				]
			: []),
		data.user
			? {
					path: p['/:lang/logout']({ lang: routing.lang }),
					name: n['/:lang/logout'](routing.lang),
				}
			: {
					path: p['/:lang/authenticate']({ lang: routing.lang }),
					name: n['/:lang/authenticate'](routing.lang),
				},
	] as const);

	function callUmamiIdentify() {
		const commonProperites = {
			language: routing.lang,
			systemColorScheme: colorScheme.system,
			userColorScheme: colorScheme.user,
		};

		if (data.user) {
			window.umami?.identify(data.user.id, {
				...commonProperites,
				name: data.user.name,
				email: data.user.email,
			});
		} else {
			window.umami?.identify(commonProperites);
		}
	}
	onMount(() => {
		if (window.umami) {
			callUmamiIdentify();
		} else {
			document.getElementById('umami-script')?.addEventListener('load', callUmamiIdentify);
		}
	});
</script>

<PageMetadata
	lang={routing.lang}
	origin={page.url.origin}
	breadcrumbs={page.data.routing?.breadcrumbs}
	{version}
	metadata={{
		...page.data.meta,
		...(page.data.routing && {
			paths: {
				default: VITE_PUBLIC_ORIGIN + page.data.routing.paths[routing.lang],
				alternate: {
					vi: VITE_PUBLIC_ORIGIN + page.data.routing.paths.vi,
					en: VITE_PUBLIC_ORIGIN + page.data.routing.paths.en,
				},
			},
		}),
	}}
	defaults={{
		title: m['pages.home.meta.title'](routing.lang).toString(),
		description: m['pages.home.meta.desc'](routing.lang).toString(),
		keywords: m['pages.home.meta.keywords'](routing.lang).toString(),
		canonical: page.url.origin + page.url.pathname,
		og: {
			type: 'website',
			siteName: m['svelte_vietnam.recruit'](routing.lang).toString(),
			image: {
				src: page.url.origin + ogImage[routing.lang],
				alt: m['svelte_vietnam.recruit'](routing.lang).toString(),
				width: 1200,
				height: 630,
				type: 'image/jpeg',
			},
		},
		twitter: {
			card: 'summary_large_image',
			site: '@sveltevietnam',
			creator: '@sveltevietnam',
		},
	}}
/>

<svelte:head>
	{#if VITE_PUBLIC_UMAMI !== '0' && VITE_PUBLIC_UMAMI !== 'false' && !browser}
		<script
			id="umami-script"
			defer
			src={VITE_PUBLIC_UMAMI_SCRIPT_URL}
			data-website-id={VITE_PUBLIC_UMAMI_WEBSITE_ID}
		></script>
	{/if}
</svelte:head>

<ContextsProvider {contexts}>
	<header
		class={[
			'max-w-pad z-header fixed flex w-full items-start justify-between transition-transform',
			'max-tablet:py-2 max-tablet:border-b max-tablet:border-outline max-tablet:items-center',
			scrollToggler.hidden && '-translate-y-full',
			'mobile:bg-surface'
		]}
		{@attach scrollToggler.attachment}
	>
		<a
			class={[
				'tablet:bg-on-surface tablet:text-surface tablet:-translate-y-2 tablet:px-4 tablet:pb-4 tablet:pt-6 ',
				'flex w-fit items-center gap-2 uppercase transition-transform duration-500 hover:translate-y-0 hover:duration-100',
			]}
			href={data.user
				? p['/:lang/postings']({ lang: routing.lang })
				: p['/:lang']({ lang: routing.lang })}
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
			{#if data.user && data.user.onboardedAt}
				<AccountMenu bind:open={isAccountMenuOpen} image={data.user.image} />
			{/if}
		</div>
	</header>

	{@render children()}

	<Footer
		email={EMAILS.JOBS}
		domain="recruit.sveltevietnam.dev"
		{version}
		{navigationPrimary}
		i18n={{
			version: m['footer.version'],
			svelte_vietnam: m['svelte_vietnam.name'],
			powered_by: m['footer.powered_by'],
			not_by_ai: m['footer.not_by_ai'],
			about: {
				heading: m['footer.about.heading'],
				desc: m['footer.about.desc'],
			},
			navigation: {
				heading: m['footer.navigation'],
			},
			contact: {
				heading: m['footer.contact'],
				discord: m['svelte_vietnam.discord'],
			},
		}}
		class={[!page.data.editUrl && 'mt-auto']}
		data-pagefind-ignore
	>
		{#snippet navigationSecondary()}
			<a
				class="c-link-lazy tablet:justify-end flex items-center gap-2"
				href={VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN}
			>
				<i class="i i-[ph--arrow-left] h-5 w-5"></i>
				<T message={m['footer.back_to_svelte_vietnam']} />
			</a>
		{/snippet}
	</Footer>
</ContextsProvider>
