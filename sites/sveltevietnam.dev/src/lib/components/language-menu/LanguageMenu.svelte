<script lang="ts">
	import { clickoutside } from '@svelte-put/clickoutside';
	import { T } from '@sveltevietnam/i18n';
	import type { HTMLAttributes } from 'svelte/elements';

	import * as m from '$data/locales/generated/messages';
	import { RoutingContext } from '$lib/routing/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	let { open = $bindable(false), class: cls, ...rest }: HTMLAttributes<HTMLElement> & {
		open?: boolean;
	} = $props();

	const routing = RoutingContext.get();
	const settings = SettingsContext.get();
</script>

<nav
	class={['relative w-fit', cls]}
	aria-label={m['components.language_menu.aria'](settings.language)}
	data-sveltekit-noscroll
	data-sveltekit-preload-data="hover"
	use:clickoutside={{ enabled: open }}
	onclickoutside={() => (open = false)}
	{...rest}
>
	<label
		class="c-link-lazy flex cursor-pointer items-center gap-2 p-2 transition-colors"
		data-umami-event="toggle-language-menu"
		data-umami-event-open={open}
	>
		<input class="peer sr-only" type="checkbox" name="language-menu" bind:checked={open} />
		<i class="i i-[ph--translate] h-6 w-6"></i>
		<span class="sr-only">
			<T message={m.open} />
			<T message={m.menu} />
		</span>
		<i class="i i-[ph--caret-down] h-5 w-5 transition-transform peer-checked:-rotate-180"></i>
	</label>
	<div
		class="_menu bg-surface absolute right-0 top-full mt-1.5 grid w-max"
		inert={settings.hydrated && !open}
	>
		<div class="overflow-hidden">
			<ul class="border-outline divide-outline divide-y border">
				<li>
					<a
						class="current:text-primary current:font-bold hover:bg-primary-surface flex items-center gap-4
						px-4 py-2"
						href={routing.paths.vi}
						data-current={settings.language === 'vi'}
					>
						<!-- no need to announce this flag image -->
						<i class="i i-flag-vn h-6"></i>
						<span class="sr-only"><T message={m['components.language_menu.switch_to']} /></span>
						<span><T message={m['languages.vietnamese']} /></span>
					</a>
				</li>
				<li>
					<a
						class="current:text-primary current:font-bold hover:bg-primary-surface flex items-center gap-4
						px-4 py-2"
						data-current={settings.language === 'en'}
						href={routing.paths.en}
					>
						<!-- no need to announce this flag image -->
						<i class="i i-flag-gb h-6"></i>
						<span class="sr-only"><T message={m['components.language_menu.switch_to']} /></span>
						<span><T message={m['languages.english']} /></span>
					</a>
				</li>
			</ul>
		</div>
	</div>
</nav>

<style lang="postcss">
	label {
		&:has(input:checked) {
			color: var(--color-link);
		}
	}

	._menu {
		grid-template-rows: 0fr;
		transition: grid-template-rows 150ms var(--default-transition-timing-function);

		nav:has(input:checked) & {
			grid-template-rows: 1fr;
		}
	}
</style>
