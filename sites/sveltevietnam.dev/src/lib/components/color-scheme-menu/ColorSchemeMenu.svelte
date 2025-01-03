<script lang="ts">
	import { clickoutside } from '@svelte-put/clickoutside';
	import { T } from '@sveltevietnam/i18n';

	import { inert } from '$lib/actions/inert';
	import { SettingsContext } from '$lib/settings/context.svelte';

	let { locale }: { locale: import('./locales/generated').Locale } = $props();

	const settings = SettingsContext.get();

	const colorSchemes = {
		light: {
			icon: 'i-[sun]',
			label: locale.light,
		},
		dark: {
			icon: 'i-[moon]',
			label: locale.dark,
		},
		system: {
			icon: 'i-[desktop]',
			label: locale.system,
		},
	};

	let open = $state(false);
</script>

<div
	class="_container relative w-fit"
	use:clickoutside={{ enabled: open }}
	onclickoutside={() => (open = false)}
>
	<label
		class="_toggler-label c-link-lazy flex cursor-pointer items-center gap-2 p-1 transition-colors"
	>
		<input class="_toggler peer sr-only" type="checkbox" name="color-scheme-menu" bind:checked={open} />
		<i class="i i-[palette] h-6 w-6"></i>
		<span class="sr-only peer-checked:hidden"><T message={locale.open} /></span>
		<span class="sr-only hidden peer-checked:block"><T message={locale.close} /></span>
		<span class="sr-only"><T message={locale.toggle} /> </span>
		<span class="desktop:sr-only"
			><T message={colorSchemes[settings.colorScheme.user].label} /></span
		>
		<i class="i i-[caret-down] h-5 w-5 transition-transform peer-checked:-rotate-180"></i>
	</label>
	<div class="_menu bg-surface absolute right-0 top-full mt-1.5 grid w-max" use:inert={!open}>
		<div class="overflow-hidden">
			<ul class="border-outline divide-outline divide-y border">
				{#each Object.entries(colorSchemes) as [key, { icon, label }]}
					<li>
						<form
							method="GET"
							onsubmit={(e) => {
								e.preventDefault();
								settings.setUserColorScheme(key as App.ColorScheme);
								open = false;
							}}
						>
							<label
								class="current:text-primary-on-surface current:font-bold hover:bg-primary-surface flex cursor-pointer items-center
								gap-4 px-4 py-2 -outline-offset-1"
								data-current={settings.colorScheme.user === key}
							>
								<input class="sr-only" type="submit" name="color-scheme" value={key} />
								<i class="i {icon} h-6 w-6"></i>
								<span><T message={label} /></span>
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
