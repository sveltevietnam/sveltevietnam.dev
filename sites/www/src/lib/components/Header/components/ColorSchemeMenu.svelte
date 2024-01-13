<script context="module" lang="ts">
	export const translations = {
		en: {
			dark: 'Dark',
			light: 'Light',
			system: 'System',
		},
		vi: {
			dark: 'Tối',
			light: 'Sáng',
			system: 'Hệ thống',
		},
	};
</script>

<script lang="ts">
	import { clickoutside } from '@svelte-put/clickoutside';

	import { getColorSchemeContext } from '$client/contexts/color-scheme';
	import { getLangContext } from '$client/contexts/lang';
	import { COLOR_SCHEMES } from '$lib/constants';

	import ColorSchemeIcon from './ColorSchemeIcon.svelte';

	let cls = '';
	export { cls as class };

	const { lang } = getLangContext();
	$: t = translations[$lang];

	const colorSchemeStore = getColorSchemeContext();
	let open = false;

	function toggle(force?: boolean) {
		open = force ?? !open;
	}
</script>

<!-- eslint-disable svelte/valid-compile -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="color-scheme-menu csm relative {cls}">
	<label
		for="csm-toggler"
		class="grid h-8 cursor-pointer place-items-center rounded-2xl border border-current px-3 hover:text-link"
		on:click|stopPropagation
	>
		<ColorSchemeIcon scheme={$colorSchemeStore} width={24} height={24} />
	</label>
	<input type="checkbox" id="csm-toggler" hidden bind:checked={open} />
	<div class="csm-dropdown" use:clickoutside={{ enabled: open }} on:clickoutside={() => toggle()}>
		<div class="overflow-hidden">
			<svg
				width="12"
				height="11"
				viewBox="0 0 12 11"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="csm-dropdown-arrow"
			>
				<path
					d="M8.16506 1.75L10.7631 6.25C11.7254 7.91667 10.5226 10 8.59808 10H3.40192C1.47742 10 0.274609 7.91667 1.23686 6.25L3.83494 1.75C4.79719 0.0833309 7.20281 0.0833325 8.16506 1.75Z"
					fill="white"
					stroke="currentcolor"
				/>
				<rect y="7" width="12" height="4" fill="white" />
			</svg>

			<ul class="relative rounded-lg border border-current bg-bg">
				{#each COLOR_SCHEMES as scheme}
					<li>
						<form
							method="GET"
							on:submit|preventDefault={() => {
								colorSchemeStore.change(scheme);
								toggle(false);
							}}
						>
							<label
								class="w-100% flex cursor-pointer items-center p-2.5 hover:text-link"
								class:text-link={scheme === $colorSchemeStore}
							>
								<input type="submit" value={scheme} name="color-scheme" hidden />
								<ColorSchemeIcon {scheme} />
								<span class="c-text-body2 ml-2">{t[scheme]}</span>
							</label>
						</form>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>

<style lang="postcss">
	.csm-dropdown {
		position: absolute;
		z-index: theme('zIndex.popup');
		top: calc(100% + 5px);
		left: 50%;
		transform: translate(-50%);

		display: grid;
		grid-template-rows: 0fr;

		width: max-content;

		transition: grid-template-rows 150ms ease-out;
	}

	#csm-toggler:checked + .csm-dropdown {
		grid-template-rows: 1fr;
	}

	svg {
		position: relative;
		z-index: 2;
		top: 5px;
		left: 50%;
		transform: translateX(-50%);

		& rect,
		& path {
			fill: theme('colors.bg.DEFAULT');
		}
	}
</style>
