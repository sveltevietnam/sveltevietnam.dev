<script lang="ts">
  import { fly } from 'svelte/transition';

  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import type { Language } from '$shared/services/i18n';
  import type { ColorScheme } from '$shared/types';

  import ColorSchemeMenu from './components/ColorSchemeMenu.svelte';
  import LanguageNav from './components/LanguageNav.svelte';
  import PageNav from './components/PageNav.svelte';

  export let lang: Language;
  export let colorScheme: ColorScheme;

  let mobileOverlayOpen = false;
  function toggleMobileOverlay() {
    mobileOverlayOpen = !mobileOverlayOpen;
  }

  afterNavigate(() => {
    mobileOverlayOpen = false;
  });

  $: isHomePage = $page.url.pathname === `/${lang}`;
</script>

<header>
  <div class="c-container">
    <div class="logo">
      <svelte:element
        this={isHomePage ? 'div' : 'a'}
        {...!isHomePage && {
          href: `/${lang}`,
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
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M21 7H3C2.4 7 2 6.6 2 6C2 5.4 2.4 5 3 5H21C21.6 5 22 5.4 22 6C22 6.6 21.6 7 21 7Z"
        />
        <path
          d="M17 11H3C2.4 11 2 10.6 2 10C2 9.4 2.4 9 3 9H17C17.6 9 18 9.4 18 10C18 10.6 17.6 11 17 11Z"
        />
        <path
          d="M21 15H3C2.4 15 2 14.6 2 14C2 13.4 2.4 13 3 13H21C21.6 13 22 13.4 22 14C22 14.6 21.6 15 21 15Z"
        />
        <path
          d="M17 19H3C2.4 19 2 18.6 2 18C2 17.4 2.4 17 3 17H17C17.6 17 18 17.4 18 18C18 18.6 17.6 19 17 19Z"
        />
      </svg>
    </button>
    {#key mobileOverlayOpen}
      <div
        class="mobile-wrapper"
        data-open={mobileOverlayOpen}
        transition:fly={{ duration: 200, x: 50 }}
      >
        <LanguageNav {lang} class="languages" />
        <PageNav {lang} class="pages" />
        <button class="mobile-close" on:click={toggleMobileOverlay}>
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.30002 25.0999L6.90002 23.6999L14.6 15.9999L6.90002 8.2999L8.30002 6.8999L16 14.5999L23.7 6.8999L25.1 8.2999L17.4 15.9999L25.1 23.6999L23.7 25.0999L16 17.3999L8.30002 25.0999Z"
            />
          </svg>
        </button>
      </div>
    {/key}
  </div>
</header>

<style lang="postcss">
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

    @screen md {
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
    grid-template-columns: 1fr auto;
    grid-template-rows: auto 1fr;
    align-items: center;

    padding: theme('spacing.4') theme('spacing.6');

    background: theme('colors.bg.200');

    @media (max-width: theme('screens.md')) {
      &[data-open]:not([data-open='false']) {
        display: grid;
      }
    }

    @screen md {
      display: contents;
    }
  }

  .mobile-close {
    grid-area: mobile-close;

    @screen md {
      display: none;
    }
  }

  .mobile-open {
    grid-area: mobile-open;

    @screen md {
      display: none;
    }
  }
</style>
