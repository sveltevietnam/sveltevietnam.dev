<script lang="ts">
	import { clickoutside } from '@svelte-put/clickoutside';
	import { T } from '@sveltevietnam/i18n';
	import type { ColorScheme } from '@sveltevietnam/kit/constants';
	import type { HTMLAttributes } from 'svelte/elements';

	import * as m from '$data/locales/generated/messages';
	import { SettingsContext } from '$lib/settings/context.svelte';

	let {
		class: cls,
		alwaysShowLabel = false,
		open = $bindable(false),
		...rest
	}: HTMLAttributes<HTMLElement> & {
		alwaysShowLabel?: boolean;
		open?: boolean;
	} = $props();

	const settings = SettingsContext.get();

	const colorSchemes = $derived({
		light: {
			icon: 'i-[ph--sun]',
			label: m['components.color_scheme_menu.light'],
		},
		dark: {
			icon: 'i-[ph--moon]',
			label: m['components.color_scheme_menu.dark'],
		},
		system: {
			icon: 'i-[ph--desktop]',
			label: m['components.color_scheme_menu.system'],
		},
	});
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
			<T message={m.open} />
			<T message={m['components.color_scheme_menu.aria']} />
		</span>
		<span class={[alwaysShowLabel && 'tablet:sr-only']} aria-hidden="true">
			<T message={colorSchemes[settings.colorScheme.user].label} />
		</span>
		<i class="i i-[ph--caret-down] h-5 w-5 transition-transform peer-checked:-rotate-180"></i>
	</label>
	<div
		class="_menu bg-surface absolute right-0 top-full mt-1.5 grid w-max"
		inert={settings.hydrated && !open}
	>
		<div class="overflow-hidden">
			<ul class="border-outline divide-outline divide-y border">
				{#each Object.entries(colorSchemes) as [key, { icon, label }] (key)}
					{@const current = settings.colorScheme.user === key}
					<li>
						<form
							method="GET"
							onsubmit={(e) => {
								e.preventDefault();
								settings.setUserColorScheme(key as ColorScheme);
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
