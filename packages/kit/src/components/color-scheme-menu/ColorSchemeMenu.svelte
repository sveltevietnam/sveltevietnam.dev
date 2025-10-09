<script lang="ts">
	import { T } from '@sveltevietnam/i18n/runtime';

	import type { ColorScheme } from '../../constants';
	import { Dropdown } from '../dropdown';

	let {
		i18n,
		open = $bindable(false),
		showLabel = 'mobile',
		colorScheme = 'system',
		onselect,
		class: cls,
		...rest
	}: import('.').ColorSchemeMenuProps = $props();

	let colorSchemes = $derived({
		light: {
			icon: 'i-[ph--sun]',
			label: i18n.light,
		},
		dark: {
			icon: 'i-[ph--moon]',
			label: i18n.dark,
		},
		system: {
			icon: 'i-[ph--desktop]',
			label: i18n.system,
		},
	});

	let labelClass = $derived(
		showLabel === 'non-mobile'
			? 'mobile:sr-only'
			: showLabel === 'mobile'
				? 'tablet:sr-only'
				: showLabel === 'never'
					? 'sr-only'
					: '',
	);

	function handleSubmit(e: SubmitEvent, key: ColorScheme) {
		const previousColorScheme = $state.snapshot(colorScheme);
		e.preventDefault();
		onselect?.(key);
		open = false;
		if (key !== previousColorScheme && 'umami' in window) {
			window.umami?.track('change-color-scheme', { from: previousColorScheme, to: key });
		}
	}
</script>

<Dropdown class={['group w-fit', cls]} {...rest}>
	{#snippet label()}
		<span class="c-link-lazy flex items-center gap-2 transition-colors">
			<i class="i i-[ph--palette] h-6 w-6"></i>
			<span class="sr-only">
				<T message={i18n.open} />
				<T message={i18n.aria} />
			</span>
			<span class={labelClass} aria-hidden="true">
				<T message={colorSchemes[colorScheme].label} />
			</span>
			<i class="i i-[ph--caret-down] h-5 w-5 transition-transform group-open:-rotate-180"></i>
		</span>
	{/snippet}

	{#snippet content()}
		<ul class="border-outline divide-outline bg-surface w-max divide-y border">
			{#each Object.entries(colorSchemes) as [key, { icon, label }] (key)}
				{@const current = colorScheme === key}
				<li>
					<form method="GET" onsubmit={(e) => handleSubmit(e, key as ColorScheme)}>
						<label
							class="current:text-primary current:font-bold hover:bg-primary-surface flex cursor-pointer items-center
								gap-4 px-4 py-2 -outline-offset-1"
							data-current={current}
						>
							<input class="sr-only" type="submit" name="color-scheme" value={key} />
							<i class="i {icon} h-6 w-6"></i>
							<span><T message={label} /></span>
							{#if current}
								<span class="sr-only">current</span>
							{/if}
						</label>
					</form>
				</li>
			{/each}
		</ul>
	{/snippet}
</Dropdown>
