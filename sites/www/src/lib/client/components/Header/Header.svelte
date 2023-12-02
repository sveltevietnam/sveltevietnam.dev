<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { getLockScrollContext } from '$client/contexts/lockscroll';
	import { HOME_PATH, isCurrentPage } from '$shared/services/navigation';
	import { clamp } from '$shared/utils/clamp';

	import ColorSchemeMenu from './components/ColorSchemeMenu.svelte';
	import LanguageNav from './components/LanguageNav.svelte';
	import PageNav from './components/PageNav.svelte';

	export let pathname: string;

	let mobileOverlayOpen = false;

	afterNavigate(() => {
		mobileOverlayOpen = false;
	});

	const lockScrollStore = getLockScrollContext();

	$: $lockScrollStore = mobileOverlayOpen;

	const MAX_SCROLL_Y = 320;
	let scrollY = 0;
	$: backdropOpacity = clamp(scrollY / MAX_SCROLL_Y, 0, 1);
	$: isHomePage = isCurrentPage(pathname, HOME_PATH);
</script>

<svelte:window bind:scrollY />

<header>
	<div class="backdrop" style="--opacity: {backdropOpacity}" aria-disabled />
	<div class="max-w-pad">
		<div class="logo">
			<svelte:element
				this={isHomePage ? 'div' : 'a'}
				{...!isHomePage && {
					href: HOME_PATH,
					title: 'Home',
				}}
				class="contents"
			>
				<svg
					inline-src="sveltevietnam"
					width="50"
					height="56"
					class="c-logo c-logo--themed"
					id="header-logo"
				/>
				<span>Svelte <br aria-disabled /> Vietnam</span>
			</svelte:element>
		</div>
		<ColorSchemeMenu class="color-scheme" />

		<label class="mobile-open" for="header-mobile-overlay-toggler">
			<span class="sr-only">Open mobile menu</span>
			<svg
				width="44"
				height="44"
				viewBox="0 0 44 44"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M37.5564 32H14.5564"
					stroke="currentcolor"
					stroke-width="2"
					stroke-linecap="square"
					stroke-linejoin="round"
				/>
				<path
					d="M21.5547 11H37.5563"
					stroke="currentcolor"
					stroke-width="2"
					stroke-linecap="square"
					stroke-linejoin="round"
				/>
				<path
					d="M6.44365 21H37.5563"
					stroke="currentcolor"
					stroke-width="2"
					stroke-linecap="square"
					stroke-linejoin="round"
				/>
			</svg>
		</label>
		<input
			type="checkbox"
			id="header-mobile-overlay-toggler"
			hidden
			bind:checked={mobileOverlayOpen}
		/>
		<div class="mobile-wrapper">
			<LanguageNav {pathname} class="languages" />
			<PageNav {pathname} class="pages" />
			<label class="mobile-close" for="header-mobile-overlay-toggler">
				<span class="sr-only">Close mobile menu</span>
				<svg inline-src="icon/x" width="44" height="44" />
			</label>
		</div>
	</div>
</header>

<style lang="postcss">
	.backdrop {
		--opacity: 0;

		position: absolute;
		z-index: -1;
		inset: 0;

		opacity: var(--opacity);
		background-color: theme('colors.bg.DEFAULT');
		border-bottom: 1px solid theme('colors.outline.DEFAULT');
	}

	header {
		--transition-duration: 250ms;
		--transition-timing-function: ease-in-out;

		position: sticky;
		z-index: theme('zIndex.header');
		top: 0;
	}

	header > div {
		display: grid;
		grid-template-areas: 'logo color-scheme mobile-open';
		grid-template-columns: 1fr auto auto;
		column-gap: theme('spacing.4');
		align-items: center;

		height: theme('spacing.header');

		@screen tb {
			grid-template-areas: 'logo pages color-scheme languages';
			grid-template-columns: auto 1fr auto auto;
		}
	}

	:global(.color-scheme) {
		grid-area: color-scheme;
	}

	:global(.pages) {
		grid-area: pages;
	}

	:global(.languages) {
		grid-area: languages;
	}

	.logo {
		display: flex;
		grid-area: logo;
		column-gap: 12px;
		align-items: center;

		@screen sp {
			& svg {
				width: auto;
				height: 36px;
			}
		}

		& span {
			column-gap: 16px;

			font-size: 15px;
			line-height: normal;
			text-transform: uppercase;

			transition: color var(--transition-duration) var(--transition-timing-function);

			@screen tb {
				font-size: 20px;
			}
		}

		& a:hover {
			color: theme('colors.link.DEFAULT');

			& :global(svg) {
				--logo-color-fg: theme('colors.link.DEFAULT');
			}
		}
	}

	.mobile-wrapper {
		pointer-events: none;

		position: fixed;
		z-index: theme('zIndex.overlay');
		inset: 0;
		transform: translateX(50px);

		display: grid;
		grid-template-areas:
			'languages mobile-close'
			'pages pages';
		grid-template-columns: auto 44px;
		grid-template-rows: auto 1fr;
		align-items: center;
		justify-content: space-between;

		padding: 16px;

		opacity: 0;
		background: radial-gradient(
			circle at -500px -500px,
			rgba(242 161 11/ 30%),
			theme('colors.bg.DEFAULT') 80%
		);
		background-color: theme('colors.bg.DEFAULT');

		transition-timing-function: ease-out;
		transition-duration: 200ms;
		transition-property: transform, opacity;

		@screen tb {
			display: contents;
		}
	}

	#header-mobile-overlay-toggler:checked + .mobile-wrapper {
		pointer-events: auto;
		transform: translateX(0);
		opacity: 1;
	}

	.mobile-close {
		grid-area: mobile-close;
		width: fit-content;

		@screen tb {
			display: none;
		}
	}

	.mobile-open {
		grid-area: mobile-open;

		@screen tb {
			display: none;
		}
	}
</style>
