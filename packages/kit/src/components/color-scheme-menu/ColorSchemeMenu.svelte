<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import type { ColorScheme } from '../../constants';
	import { Dropdown } from '../dropdown';

	let {
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
			i18nKey: 'components.color_scheme_menu.light',
		},
		dark: {
			icon: 'i-[ph--moon]',
			i18nKey: 'components.color_scheme_menu.dark',
		},
		system: {
			icon: 'i-[ph--desktop]',
			i18nKey: 'components.color_scheme_menu.system',
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

	async function update(key: ColorScheme) {
		if (!onselect) return;
		if (!document.startViewTransition) {
			onselect(key);
			return;
		}

		const transition = document.startViewTransition(() => {
			onselect(key);
			document.documentElement.classList.toggle('in-theme-transition', true);
		});

		await transition.finished;
		document.documentElement.classList.toggle('in-theme-transition', false);
	}

	function handleSubmit(e: SubmitEvent, key: ColorScheme) {
		const previousColorScheme = $state.snapshot(colorScheme);
		e.preventDefault();
		update(key);
		open = false;
		if (key !== previousColorScheme && 'umami' in window) {
			window.umami?.track('change-color-scheme', { from: previousColorScheme, to: key });
		}
	}
</script>

<Dropdown
	class={['group w-fit', cls]}
	{...rest}
	aria-labelledby="color-scheme-menu-label"
	bind:open
>
	{#snippet label()}
		<span class="c-link-lazy flex items-center gap-2 transition-colors">
			<i class="i i-[ph--palette] h-6 w-6"></i>
			<span class="sr-only" id="color-scheme-menu-label">
				<T key="components.color_scheme_menu.aria" />
			</span>
			<span class={labelClass} aria-hidden="true">
				<T key={colorSchemes[colorScheme].i18nKey} />
			</span>
			<i class="i i-[ph--caret-down] h-5 w-5 transition-transform group-open:-rotate-180"></i>
		</span>
	{/snippet}

	{#snippet content()}
		<ul class="border-outline divide-outline bg-surface w-max divide-y border">
			{#each Object.entries(colorSchemes) as [key, { icon, i18nKey }] (key)}
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
							<span><T key={i18nKey} /></span>
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

<style lang="postcss">
	:global {
		:root.in-theme-transition {
			&::view-transition-old(root) {
				animation-delay: 600ms;
			}

			&::view-transition-new(root) {
				animation: circle-in 600ms var(--default-transition-timing-function);
			}

			@media (prefers-reduced-motion: reduce) {
				&::view-transition-old(root) {
					animation-duration: 0ms;
				}

				&::view-transition-new(root) {
					animation-duration: 0ms;
				}
			}
		}

		@keyframes circle-in {
			from {
				clip-path: circle(0% at 100% 0%);
			}

			to {
				clip-path: circle(140% at 100% 0%);
			}
		}
	}
</style>
