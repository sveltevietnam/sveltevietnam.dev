<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import { ColorSchemeMenu } from '$lib/components/color-scheme-menu';
	import { LanguageMenu } from '$lib/components/language-menu';
	import { RoutingContext } from '$lib/routing/context.svelte';

	const routing = RoutingContext.get();

	let {
		locale,
		localeLanguageMenu,
		localeColorSchemeMenu,
	}: {
		locale: import('./locales/generated').Locale;
		localeLanguageMenu: import('$lib/components/language-menu/locales/generated').Locale;
		localeColorSchemeMenu: import('$lib/components/color-scheme-menu/locales/generated').Locale;
	} = $props();
</script>

<div class="max-w-pad flex items-start justify-between">
	<a
		class="
			bg-on-surface text-surface flex w-fit -translate-y-2 items-center gap-2 px-4 pb-4
			pt-6 transition-transform duration-500 hover:translate-y-0 hover:duration-100
		"
		href={routing.path('home')}
	>
		<i class="i i-sveltevietnam w-15 h-15"></i>
		<span class="c-text-title-sm max-w-25 uppercase">{locale.sveltevietnam}</span>
	</a>
	<div class="bg-surface flex w-fit items-center gap-5 border-x border-b px-6 py-5">
		<form>
			<label class="c-text-input w-40">
				<span class="sr-only"><T message={locale.search} /></span>
				<i class="i i-[magnifying-glass] h-6 w-6"></i>
				<input class="w-full" name="search" placeholder="{locale.search}..." />
			</label>
		</form>
		<LanguageMenu locale={localeLanguageMenu} />
		<ColorSchemeMenu locale={localeColorSchemeMenu} />
	</div>
</div>
