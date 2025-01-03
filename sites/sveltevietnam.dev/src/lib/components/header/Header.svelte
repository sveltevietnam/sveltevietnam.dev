<script lang="ts">
	import { ColorSchemeMenu } from '$lib/components/color-scheme-menu';
	import { LanguageMenu } from '$lib/components/language-menu';

	let {
		localeLanguageMenu,
		localeColorSchemeMenu,
	}: {
		locale: import('./locales/generated').Locale,
		localeLanguageMenu: import('$lib/components/language-menu/locales/generated').Locale,
		localeColorSchemeMenu: import('$lib/components/color-scheme-menu/locales/generated').Locale,
	} = $props();
</script>

<div class="h-header max-w-pad">
	<div class="flex gap-5">
		<LanguageMenu locale={localeLanguageMenu} />
		<ColorSchemeMenu locale={localeColorSchemeMenu} />
	</div>
</div>
