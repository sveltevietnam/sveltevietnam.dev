<script lang="ts">
	import { clickoutside } from '@svelte-put/clickoutside';
	import { T } from '@sveltevietnam/i18n';

	let {
		i18n,
		routing,
		hydrated,
		lang,
		open = $bindable(false),
		class: cls,
		...rest
	}: import('.').LanguageMenuProps = $props();
</script>

<nav
	class={['relative w-fit', cls]}
	aria-label={i18n.aria(lang)}
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
			<T message={i18n.open} />
			<T message={i18n.menu} />
		</span>
		<i class="i i-[ph--caret-down] h-5 w-5 transition-transform peer-checked:-rotate-180"></i>
	</label>
	<div
		class="_menu bg-surface absolute right-0 top-full mt-1.5 grid w-max"
		inert={hydrated && !open}
	>
		<div class="overflow-hidden">
			<ul class="border-outline divide-outline divide-y border">
				<li>
					<a
						class="current:text-primary current:font-bold hover:bg-primary-surface flex items-center gap-4
						px-4 py-2"
						href={routing.vi}
						data-current={lang === 'vi'}
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
						data-current={lang === 'en'}
						href={routing.en}
					>
						<!-- no need to announce this flag image -->
						<i class="i i-flag-gb h-6"></i>
						<span class="sr-only"><T message={i18n.switchTo} /></span>
						<span><T message={i18n.english} /></span>
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
