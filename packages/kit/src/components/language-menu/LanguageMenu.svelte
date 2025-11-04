<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import { Dropdown } from '../dropdown';

	let {
		routing,
		lang,
		showLabel = 'mobile',
		open = $bindable(false),
		class: cls,
		...rest
	}: import('.').LanguageMenuProps = $props();

	let labelClass = $derived(
		showLabel === 'non-mobile'
			? 'mobile:sr-only'
			: showLabel === 'mobile'
				? 'tablet:sr-only'
				: showLabel === 'never'
					? 'sr-only'
					: '',
	);

	let languageNames = $derived(new Intl.DisplayNames([lang], { type: 'language' }));
</script>

<Dropdown class={['group w-fit', cls]} {...rest} aria-labelledby="language-menu-label" bind:open>
	{#snippet label()}
		<span class="c-link-lazy flex items-center gap-2 transition-colors">
			<i class="i i-[ph--translate] h-6 w-6"></i>
			<span class="sr-only" id="language-menu-label">
				<T key="components.language_menu.aria" />
			</span>
			<span class={labelClass} aria-hidden="true">
				{#if lang === 'vi'}
					{languageNames.of('vi')}
				{:else}
					{languageNames.of('en')}
				{/if}
			</span>
			<i class="i i-[ph--caret-down] h-5 w-5 transition-transform group-open:-rotate-180"></i>
		</span>
	{/snippet}

	{#snippet content()}
		<ul class="border-outline divide-outline bg-surface w-max divide-y border">
			<li>
				<a
					class="current:text-primary current:font-bold hover:bg-primary-surface flex items-center gap-4
						px-4 py-2"
					href={routing.vi}
					data-current={lang === 'vi'}
					data-sveltekit-replacestate
					data-sveltekit-keepfocus
					data-sveltekit-noscroll
				>
					<!-- no need to announce this flag image -->
					<i class="i i-flag-vn h-6"></i>
					<span class="sr-only"><T key="components.language_menu.switch_to" /></span>
					<span>{languageNames.of('vi')}</span>
				</a>
			</li>
			<li>
				<a
					class="current:text-primary current:font-bold hover:bg-primary-surface flex items-center gap-4
						px-4 py-2"
					href={routing.en}
					data-current={lang === 'en'}
					data-sveltekit-replacestate
					data-sveltekit-keepfocus
					data-sveltekit-noscroll
				>
					<!-- no need to announce this flag image -->
					<i class="i i-flag-gb h-6"></i>
					<span class="sr-only"><T key="components.language_menu.switch_to" /></span>
					<span>{languageNames.of('en')}</span>
				</a>
			</li>
		</ul>
	{/snippet}
</Dropdown>
