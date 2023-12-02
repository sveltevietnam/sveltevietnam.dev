<script lang="ts">
	import { getColorSchemeContext } from '$client/contexts/color-scheme';
	import { getLangContext } from '$client/contexts/lang';
	import { COLOR_SCHEMES } from '$shared/constants';
	import { translations } from '$shared/services/i18n/translations/color-scheme';

	import ColorSchemeIcon from './ColorSchemeIcon.svelte';

	let cls = '';
	export { cls as class };

	const langStore = getLangContext();
	$: lang = $langStore;
	$: t = translations[lang];

	const colorSchemeStore = getColorSchemeContext();
</script>

<div class="color-scheme-menu csm relative {cls}">
	<label
		for="csm-toggler"
		class="grid h-8 cursor-pointer place-items-center rounded-2xl border border-current px-3 hover:text-link"
	>
		<ColorSchemeIcon scheme={$colorSchemeStore} width={24} height={24} />
	</label>
	<input type="checkbox" checked={false} id="csm-toggler" hidden />
	<div class="csm-dropdown">
		<div class="overflow-hidden">
			<svg inline-src="./arrow.svg" class="csm-dropdown-arrow" />
			<ul class="relative rounded-lg border border-current bg-bg">
				{#each COLOR_SCHEMES as scheme}
					<li>
						<form method="GET" on:submit|preventDefault={() => colorSchemeStore.change(scheme)}>
							<label
								class="w-100% flex cursor-pointer items-center p-2.5 hover:text-link"
								class:text-link={scheme === $colorSchemeStore}
							>
								<input type="submit" value={scheme} name="color-scheme" hidden />
								<ColorSchemeIcon {scheme} />
								<span class="tp-body2 ml-2">{t[scheme]}</span>
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
