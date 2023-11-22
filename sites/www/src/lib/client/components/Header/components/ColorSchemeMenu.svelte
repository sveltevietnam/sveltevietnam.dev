<script lang="ts">
	import { clickoutside } from '@svelte-put/clickoutside';
	import { slide, fade } from 'svelte/transition';

	import { getColorSchemeContext } from '$client/contexts/color-scheme';
	import { getLangContext } from '$client/contexts/lang';
	import { translations } from '$shared/services/i18n/translations/color-scheme';

	import ColorSchemeIcon from './ColorSchemeIcon.svelte';

	const langStore = getLangContext();
	$: lang = $langStore;

	let cls = '';
	export { cls as class };

	const SCHEMES = {
		light: {
			scheme: 'light',
		},
		dark: {
			scheme: 'dark',
		},
		system: {
			scheme: 'system',
		},
	} as const;
	let themeMenuOpen = false;
	function toggleThemeMenu() {
		themeMenuOpen = !themeMenuOpen;
	}
	$: t = translations[lang];

	const colorSchemeStore = getColorSchemeContext();
</script>

<div class="color-scheme-menu {cls}" data-expanded={themeMenuOpen}>
	{#key $colorSchemeStore}
		<button
			class="color-scheme-menu__toggler"
			on:click|stopPropagation={toggleThemeMenu}
			in:fade|local={{ duration: 150 }}
			aria-label="Color scheme menu"
		>
			<ColorSchemeIcon scheme={SCHEMES[$colorSchemeStore].scheme} width={24} height={24} />
		</button>
	{/key}
	{#key themeMenuOpen}
		<div
			class="color-scheme-menu__dropdown"
			class:hidden={!themeMenuOpen}
			transition:slide|local={{ duration: 150 }}
			use:clickoutside={{ enabled: themeMenuOpen }}
			on:clickoutside={toggleThemeMenu}
		>
			<div>
				<svg
					width="12"
					height="11"
					viewBox="0 0 12 11"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M8.16506 1.75L10.7631 6.25C11.7254 7.91667 10.5226 10 8.59808 10H3.40192C1.47742 10 0.274609 7.91667 1.23686 6.25L3.83494 1.75C4.79719 0.0833309 7.20281 0.0833325 8.16506 1.75Z"
						fill="white"
						stroke="currentcolor"
					/>
					<rect y="7" width="12" height="4" fill="white" />
				</svg>
				<ul class="tp-body2">
					{#each Object.values(SCHEMES) as s}
						<li>
							<button
								on:click={() => colorSchemeStore.change(s.scheme)}
								class="color-scheme-menu__option"
								class:text-primary={$colorSchemeStore === s.scheme}
							>
								<ColorSchemeIcon scheme={s.scheme} />
								<span class="whitespace-nowrap">{t[s.scheme]}</span>
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/key}
</div>

<style lang="postcss">
	.color-scheme-menu {
		position: relative;
		display: grid;
		place-items: center;
	}

	.color-scheme-menu__toggler {
		height: 32px;
		padding: 0 12px;
		border: 1px solid currentcolor;
		border-radius: 16px;

		&:hover {
			color: theme('colors.svelte');
		}
	}

	.color-scheme-menu__option {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 10px;

		&:hover {
			color: theme('colors.svelte');
		}

		& span {
			margin-left: 8px;
		}
	}

	.color-scheme-menu__dropdown {
		position: absolute;
		z-index: theme('zIndex.popup');
		top: calc(100% + 10px);
		left: 50%;
		transform: translate(-50%);

		& div {
			display: flex;
			flex-direction: column;
			align-items: center;

			& svg {
				z-index: 2;

				& rect,
				& path {
					fill: theme('colors.bg.DEFAULT');
				}
			}

			& ul {
				position: relative;
				z-index: 1;
				top: -5px;

				background-color: theme('colors.bg.DEFAULT');
				border: 1px solid currentcolor;
				border-radius: 8px;
			}
		}
	}
</style>
