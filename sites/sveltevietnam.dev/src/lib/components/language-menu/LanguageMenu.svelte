<script lang="ts">
	import { clickoutside } from '@svelte-put/clickoutside';
	import { T } from '@sveltevietnam/i18n';
	import type { HTMLAttributes } from 'svelte/elements';

	import { invalidate } from '$app/navigation';
	import * as m from '$data/locales/generated/messages';
	import { LOAD_DEPENDENCIES } from '$lib/constants';
	import { RoutingContext } from '$lib/routing/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	import flagGb from './images/flag-gb.svg';
	import flagVn from './images/flag-vn.svg';

	let { class: cls, ...rest }: HTMLAttributes<HTMLElement> = $props();

	const routing = RoutingContext.get();
	const settings = SettingsContext.get();

	let currentLangLabel = $derived(
		settings.language === 'vi'
			? m['components.language_menu.vietnamese']
			: m['components.language_menu.english'],
	);
	let open = $state(false);

	function reloadLanguage() {
		open = false;
		invalidate(LOAD_DEPENDENCIES.LANGUAGE);
	}
</script>

<nav
	class={['relative w-fit', cls]}
	aria-label={m['components.language_menu.aria'](settings.language).aria}
	data-sveltekit-noscroll
	data-sveltekit-preload-data="hover"
	use:clickoutside={{ enabled: open }}
	onclickoutside={() => (open = false)}
	{...rest}
>
	<label class="c-link-lazy flex cursor-pointer items-center gap-2 p-2 transition-colors">
		<input class="peer sr-only" type="checkbox" name="language-menu" bind:checked={open} />
		<i class="i i-[translate] h-6 w-6"></i>
		<span class="sr-only peer-checked:hidden"><T message={m.open} /></span>
		<span class="sr-only hidden peer-checked:block"><T message={m.close} /></span>
		<span class="sr-only"><T message={m['components.language_menu.toggle']} /></span>
		<span class="tablet:sr-only"><T message={currentLangLabel} /></span>
		<i class="i i-[caret-down] h-5 w-5 transition-transform peer-checked:-rotate-180"></i>
	</label>
	<div
		class="_menu bg-surface absolute right-0 top-full mt-1.5 grid w-max"
		inert={settings.hydrated && !open}
	>
		<div class="overflow-hidden">
			<ul class="border-outline divide-outline divide-y border">
				<li>
					<a
						class="current:text-primary-on-surface current:font-bold hover:bg-primary-surface flex items-center gap-4
						px-4 py-2"
						href={routing.paths.vi.path}
						data-current={settings.language === 'vi'}
						onclick={reloadLanguage}
					>
						<!-- no need to announce this flag image -->
						<img class="h-6 w-9" src={flagVn} alt="" width="36" height="24" />
						<span class="sr-only"><T message={m['components.language_menu.switch_to']} /></span>
						<span><T message={m['components.language_menu.vietnamese']} /></span>
					</a>
				</li>
				<li>
					<a
						class="current:text-primary-on-surface current:font-bold hover:bg-primary-surface flex items-center gap-4
						px-4 py-2"
						data-current={settings.language === 'en'}
						href={routing.paths.en.path}
						onclick={reloadLanguage}
					>
						<!-- no need to announce this flag image -->
						<img class="h-6 w-9" src={flagGb} alt="" width="36" height="24" />
						<span class="sr-only"><T message={m['components.language_menu.switch_to']} /></span>
						<span><T message={m['components.language_menu.english']} /></span>
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
