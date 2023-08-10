<script lang="ts">
  import { fly } from 'svelte/transition';

  import { afterNavigate } from '$app/navigation';
  import type { Language } from '$shared/services/i18n';
  import { HOME_PATH, isCurrentPage } from '$shared/services/navigation';
  import type { ColorScheme } from '$shared/types';
  import { clamp } from '$shared/utils/clamp';

  import ColorSchemeMenu from './components/ColorSchemeMenu.svelte';
  import LanguageNav from './components/LanguageNav.svelte';
  import PageNav from './components/PageNav.svelte';

  export let pathname: string;
  export let lang: Language;
  export let colorScheme: ColorScheme;

  let mobileOverlayOpen = false;
  function toggleMobileOverlay() {
    mobileOverlayOpen = !mobileOverlayOpen;
  }

  afterNavigate(() => {
    mobileOverlayOpen = false;
  });

  const MAX_SCROLL_Y = 320;
  let scrollY = 0;
  $: backdropOpacity = clamp(scrollY / MAX_SCROLL_Y, 0, 1);
  $: isHomePage = isCurrentPage(pathname, HOME_PATH);
</script>

<svelte:window bind:scrollY />

<header>
  <div class="backdrop" style="--opacity: {backdropOpacity}" aria-disabled />
  <div class="c-container-design">
    <div class="logo">
      <svelte:element
        this={isHomePage ? 'div' : 'a'}
        {...!isHomePage && {
          href: HOME_PATH,
          title: 'Home',
        }}
        class="contents"
      >
        <svg inline-src="sveltevietnam-grayscale" width="50" height="56" />
        <span>Svelte <br aria-disabled /> Vietnam</span>
      </svelte:element>
    </div>
    <ColorSchemeMenu {lang} {colorScheme} on:colorSchemeChange class="color-scheme" />

    <button class="mobile-open" on:click={toggleMobileOverlay}>
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
    </button>
    {#key mobileOverlayOpen}
      <div
        class="mobile-wrapper"
        data-open={mobileOverlayOpen}
        transition:fly={{ duration: 200, x: 50 }}
      >
        <LanguageNav {pathname} {lang} class="languages" />
        <PageNav {pathname} {lang} class="pages" />
        <button class="mobile-close" on:click={toggleMobileOverlay}>
          <svg inline-src="icon/x" width="44" height="44" />
        </button>
      </div>
    {/key}
  </div>
</header>

<style lang="postcss">
  .backdrop {
    --opacity: 0;

    position: absolute;
    z-index: -1;
    inset: 0;

    opacity: var(--opacity);
    background-color: theme('colors.design.bg.1');
    border-bottom: 1px solid theme('colors.design.border.1');
  }

  header {
    --active-color: theme('colors.svelte');
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

    & :global(.bg) {
      transition: fill var(--transition-duration) var(--transition-timing-function);
    }

    & a:hover {
      color: var(--active-color);

      & :global(.bg) {
        fill: var(--active-color);
      }
    }
  }

  .mobile-wrapper {
    position: fixed;
    z-index: theme('zIndex.overlay');
    inset: 0;

    display: none;
    grid-template-areas:
      'languages mobile-close'
      'pages pages';
    grid-template-columns: auto auto;
    grid-template-rows: auto 1fr;
    align-items: center;
    justify-content: space-between;

    padding: 16px;

    background: radial-gradient(
      circle at -500px -500px,
      rgba(242 161 11/ 30%),
      theme('colors.design.bg.1') 80%
    );
    background-color: theme('colors.design.bg.1');

    @screen upto-tb {
      &[data-open]:not([data-open='false']) {
        display: grid;
      }
    }

    @screen tb {
      display: contents;
    }
  }

  .mobile-close {
    grid-area: mobile-close;

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
