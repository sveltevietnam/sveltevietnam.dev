<script lang="ts">
	import { T } from '@sveltevietnam/i18n/runtime';

	import { Dropdown } from '../dropdown';

	let {
		i18n,
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
</script>

<Dropdown class={['group w-fit', cls]} {...rest}>
	{#snippet label()}
		<span class="c-link-lazy flex items-center gap-2 transition-colors">
			<i class="i i-[ph--translate] h-6 w-6"></i>
			<span class="sr-only">
				<T message={i18n.open} />
				<T message={i18n.menu} />
			</span>
			<span class={labelClass} aria-hidden="true">
				{#if lang === 'vi'}
					<T message={i18n.vietnamese} />
				{:else}
					<T message={i18n.english} />
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
					<span class="sr-only"><T message={i18n.switchTo} /></span>
					<span><T message={i18n.vietnamese} /></span>
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
					<span class="sr-only"><T message={i18n.switchTo} /></span>
					<span><T message={i18n.english} /></span>
				</a>
			</li>
		</ul>
	{/snippet}
</Dropdown>
