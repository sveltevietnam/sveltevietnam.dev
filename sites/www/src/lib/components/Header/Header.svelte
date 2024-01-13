<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { getLockScrollContext } from '$client/contexts/lockscroll';
	import { getNavigationContext } from '$client/contexts/navigation';
	import { clamp } from '$lib/utils/clamp';

	import ColorSchemeMenu from './components/ColorSchemeMenu.svelte';
	import LanguageNav from './components/LanguageNav.svelte';
	import PageNav from './components/PageNav.svelte';

	let mobileOverlayOpen = false;

	afterNavigate(() => {
		mobileOverlayOpen = false;
	});

	const lockScrollStore = getLockScrollContext();
	const { routes, is } = getNavigationContext();

	$: $lockScrollStore = mobileOverlayOpen;

	const MAX_SCROLL_Y = 320;
	let scrollY = 0;
	$: backdropOpacity = clamp(scrollY / MAX_SCROLL_Y, 0, 1);
	$: isHomePage = $is($routes.home.path);
</script>

<svelte:window bind:scrollY />

<header>
	<div class="backdrop" style="--opacity: {backdropOpacity}" aria-disabled />
	<div class="max-w-pad">
		<div class="logo">
			<svelte:element
				this={isHomePage ? 'div' : 'a'}
				{...!isHomePage && {
					href: $routes.home.path,
					title: 'Home',
				}}
				class="contents"
			>
				<svg
					width="50"
					height="56"
					viewBox="0 0 37 42"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					id="header-logo"
				>
					<g class="hat">
						<path
							d="M33.2414 2.13053C28.6268 3.72786 21.0763 8.20926 14.5537 13.8813C5.13226 22.075 0.110928 30.1873 2.02628 31.9252C4.3114 34.0032 10.0722 29.9507 10.2202 30.106C10.3828 30.2909 7.39519 32.5168 5.16924 33.3598C2.42562 34.3951 0.0147904 33.4559 0 31.0378L1.13886 3.85358C1.19802 1.96045 3.17993 0.230006 5.16184 0.311352C5.16184 0.311352 26.9924 1.29489 33.1674 1.59069C33.4928 1.60548 33.5446 2.027 33.2414 2.13053Z"
							class="bg"
						/>
						<path
							d="M29.3071 9.49528C29.9949 9.78369 30.7862 9.60621 31.2151 8.99242C32.4575 7.19542 34.5577 3.86026 33.6925 2.99504C33.0269 2.32209 28.3827 5.15439 24.4781 7.73526C23.635 8.28989 24.1749 9.60621 25.1658 9.41394C26.6966 9.11074 28.2126 9.04418 29.3071 9.50268V9.49528Z"
							class="bg"
						/>
						<path
							d="M3.38672 31.063C4.22237 32.1723 6.82548 30.9891 8.43763 30.0943C9.17715 29.6802 9.53212 28.8519 9.29547 28.0902C8.90353 26.8183 8.4894 24.6441 9.08841 22.0559C9.19934 21.5678 8.54856 21.2794 8.21578 21.6713C5.91587 24.3631 2.07037 29.3252 3.39411 31.0704L3.38672 31.063Z"
							class="bg"
						/>
						<path
							d="M5.014 5.14453L6.89238 6.12807L8.76336 5.14453L8.40839 7.22993L9.92441 8.70894L7.83157 9.01214L6.89238 10.9127L5.95319 9.01214L3.86035 8.70894L5.37637 7.22993L5.014 5.14453Z"
							class="fg"
						/>
					</g>
					<g class="svelte">
						<path
							d="M35.0307 14.2417C32.1022 10.0339 26.3118 8.79157 22.1335 11.4612L14.7827 16.157C13.7917 16.7856 12.9413 17.6139 12.2831 18.5826C11.6249 19.5588 11.1812 20.6606 10.9742 21.8142C10.671 23.4929 10.8558 25.2234 11.5066 26.7911C11.6989 27.2644 11.6693 27.7894 11.4327 28.2405C11.0333 29.0096 10.7449 29.8305 10.5896 30.6883C10.3826 31.8715 10.4047 33.0843 10.671 34.2527C10.9372 35.4211 11.4253 36.5304 12.1204 37.5065C15.0489 41.7143 20.8394 42.9567 25.0176 40.2871L32.3685 35.5912C33.3594 34.9626 34.2099 34.1344 34.868 33.1656C35.5262 32.1895 35.9699 31.0876 36.177 29.934C36.4802 28.2553 36.2953 26.5249 35.6445 24.9571C35.4522 24.4839 35.4818 23.9588 35.7185 23.5077C36.1178 22.7386 36.4062 21.9178 36.5615 21.0599C36.7686 19.8767 36.7464 18.6639 36.4802 17.4955C36.2139 16.3271 35.7259 15.2179 35.0307 14.2417Z"
							class="bg"
						/>
						<path
							d="M21.416 37.916C20.2624 38.2192 19.0422 38.1526 17.9181 37.7385C16.8015 37.3244 15.8327 36.5701 15.1523 35.5865C14.7308 35.0023 14.435 34.3368 14.2797 33.6343C14.1244 32.9317 14.1022 32.1996 14.2279 31.4897C14.2723 31.253 14.3315 31.0238 14.4054 30.8019L14.5459 30.3804L14.6864 30.484C15.707 31.2383 16.8532 31.8151 18.0734 32.1848L18.0512 32.4584C18.0143 32.8504 18.1252 33.2349 18.347 33.5529C18.5541 33.8487 18.8425 34.078 19.1827 34.2037C19.5229 34.3294 19.8852 34.3516 20.2328 34.2554C20.3955 34.2111 20.5434 34.1445 20.6839 34.0558L28.0347 29.3599C28.2122 29.249 28.3675 29.0937 28.4858 28.9162C28.6042 28.7387 28.6855 28.5391 28.7225 28.332C28.7595 28.1175 28.7521 27.8957 28.7077 27.6886C28.6633 27.4742 28.5672 27.2745 28.4415 27.097C28.2344 26.8012 27.946 26.572 27.6058 26.4463C27.2656 26.3205 26.9033 26.2984 26.5557 26.3945C26.393 26.4389 26.2451 26.5054 26.1046 26.5942L23.3018 28.3838C22.8433 28.6796 22.3404 28.9014 21.808 29.0419C20.6543 29.3451 19.4341 29.2786 18.3101 28.8644C17.1934 28.4503 16.2246 27.696 15.5443 26.7125C15.1227 26.1283 14.8269 25.4627 14.6716 24.7602C14.5163 24.0577 14.4942 23.3256 14.6199 22.6156C14.7456 21.9205 15.0118 21.2549 15.4038 20.6707C15.7957 20.0865 16.3134 19.5837 16.905 19.2139L24.2558 14.5181C24.7143 14.2223 25.2172 14.0004 25.7496 13.8599C26.9033 13.5567 28.1235 13.6233 29.2476 14.0374C30.3642 14.4515 31.333 15.2058 32.0134 16.1893C32.4349 16.7735 32.7307 17.4391 32.886 18.1416C33.0413 18.8442 33.0635 19.5763 32.9378 20.2862C32.8934 20.5228 32.8342 20.7521 32.7603 20.9739L32.6198 21.3955L32.4792 21.2919C31.4587 20.5376 30.3125 19.9682 29.0996 19.5985L29.1218 19.3248C29.1514 18.9329 29.0479 18.5484 28.826 18.2304C28.619 17.9346 28.3305 17.7053 27.9904 17.5796C27.6502 17.4539 27.2878 17.4317 26.9403 17.5278C26.7776 17.5722 26.6297 17.6388 26.4891 17.7275L19.1383 22.4234C18.9608 22.5343 18.8055 22.6896 18.6872 22.8597C18.5689 23.0371 18.4876 23.2368 18.4506 23.4439C18.4136 23.6583 18.421 23.8802 18.4654 24.0872C18.5097 24.3017 18.6059 24.5014 18.7316 24.6789C18.9387 24.9747 19.2271 25.2039 19.5672 25.3296C19.9074 25.4553 20.2698 25.4775 20.6174 25.3814C20.7801 25.337 20.928 25.2705 21.0685 25.1817L23.8712 23.3921C24.3298 23.0963 24.8326 22.8745 25.3651 22.734C26.5187 22.4308 27.7389 22.4973 28.863 22.9114C29.9797 23.3256 30.9484 24.0799 31.6288 25.0634C32.0503 25.6476 32.3461 26.3132 32.5014 27.0157C32.6567 27.7182 32.6789 28.4503 32.5532 29.1602C32.4275 29.8554 32.1613 30.5209 31.7693 31.1051C31.3774 31.6894 30.8597 32.1922 30.2681 32.5694L22.9173 37.2652C22.4588 37.561 21.9559 37.7829 21.4234 37.9234L21.416 37.916Z"
							class="fg"
						/>
					</g>
				</svg>
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
			<LanguageNav class="languages" />
			<PageNav class="pages" />
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

	#header-mobile-overlay-toggler:not(:checked) + .mobile-wrapper {
		@screen upto-tb {
			pointer-events: none;
		}
	}

	#header-mobile-overlay-toggler:checked + .mobile-wrapper {
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

	#header-logo {
		--logo-color-fg: white;
		--logo-color-bg: black;

		@dark global {
			--logo-color-fg: black;
			--logo-color-bg: white;
		}

		& .fg {
			fill: var(--logo-color-fg);
		}

		& .bg {
			fill: var(--logo-color-bg);
		}
	}
</style>
