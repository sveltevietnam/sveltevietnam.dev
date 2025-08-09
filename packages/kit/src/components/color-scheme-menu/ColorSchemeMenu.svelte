<script lang="ts">
	import { clickoutside } from '@svelte-put/clickoutside';
	import { T } from '@sveltevietnam/i18n';

	import type { ColorScheme } from '../../constants';

	let {
		i18n,
		hydrated,
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
</script>

<div
	class={['_container relative w-fit', cls]}
	use:clickoutside={{ enabled: open }}
	onclickoutside={() => (open = false)}
	{...rest}
>
	<label
		class="_toggler-label c-link-lazy flex cursor-pointer items-center gap-2 p-2 transition-colors"
		data-umami-event="toggle-color-scheme-menu"
		data-umami-event-open={open}
	>
		<input
			class="_toggler peer sr-only"
			type="checkbox"
			name="color-scheme-menu"
			bind:checked={open}
		/>
		<i class="i i-[ph--palette] h-6 w-6"></i>
		<span class="sr-only">
			<T message={i18n.open} />
			<T message={i18n.aria} />
		</span>
		<span class={labelClass} aria-hidden="true">
			<T message={colorSchemes[colorScheme].label} />
		</span>
		<i class="i i-[ph--caret-down] h-5 w-5 transition-transform peer-checked:-rotate-180"></i>
	</label>
	<div
		class="_menu bg-surface absolute right-0 top-full mt-1.5 grid w-max"
		inert={hydrated && !open}
	>
		<div class="overflow-hidden">
			<ul class="border-outline divide-outline divide-y border">
				{#each Object.entries(colorSchemes) as [key, { icon, label }] (key)}
					{@const current = colorScheme === key}
					<li>
						<form
							method="GET"
							onsubmit={(e) => {
								e.preventDefault();
								onselect?.(key as ColorScheme);
								open = false;
							}}
						>
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
		</div>
	</div>
</div>

<style lang="postcss">
	._toggler-label {
		&:has(input:checked) {
			color: var(--color-link);
		}
	}

	._menu {
		grid-template-rows: 0fr;
		transition: grid-template-rows 150ms var(--default-transition-timing-function);

		._container:has(._toggler:checked) & {
			grid-template-rows: 1fr;
		}
	}
</style>
