<script lang="ts">
	import LanguageMenu from '../language-menu/LanguageMenu.svelte';

	let {
		localeLanguageMenu,
	}: {
		locale:
			import('./locales/generated').Locale,
			localeLanguageMenu: import('$lib/components/language-menu/locales/generated').Locale,
	} = $props();
</script>

<div class="h-header max-w-pad">
	<LanguageMenu locale={localeLanguageMenu} />
</div>
