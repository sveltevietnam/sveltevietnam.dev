<script lang="ts">
  import { clickoutside } from '@svelte-put/clickoutside';
  import { createEventDispatcher } from 'svelte';
  import { fly, slide, fade } from 'svelte/transition';

  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import { APP_ROUTE_TREE } from '$shared/constants';
  import { localizeUrl, type Language, LANGUAGES } from '$shared/services/i18n';
  import { translations } from '$shared/services/i18n/translations/header';
  import type { ColorScheme } from '$shared/types';

  import ColorSchemeIcon from './ColorSchemeIcon.svelte';

  export let lang: Language;
  export let colorScheme: ColorScheme;

  const dispatch = createEventDispatcher<{ colorSchemeChange: ColorScheme }>();

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
  function changeColorScheme(_scheme: ColorScheme) {
    dispatch('colorSchemeChange', _scheme);
  }

  $: t = translations[lang];
  $: navLinks = {
    events: {
      text: t.navigation.events,
      href: APP_ROUTE_TREE[':lang'].events.$.path({ args: { ':lang': lang } }),
    },
    jobs: {
      text: t.navigation.jobs,
      href: APP_ROUTE_TREE[':lang'].jobs.$.path({ args: { ':lang': lang } }),
    },
    impact: {
      text: t.navigation.impact,
      href: APP_ROUTE_TREE[':lang'].impact.$.path({ args: { ':lang': lang } }),
    },
    people: {
      text: t.navigation.people,
      href: APP_ROUTE_TREE[':lang'].people.$.path({ args: { ':lang': lang } }),
    },
    sponsor: {
      text: t.navigation.sponsor,
      href: APP_ROUTE_TREE[':lang'].sponsor.$.path({ args: { ':lang': lang } }),
    },
  };

  function changeLanguage(lang: Language) {
    document.documentElement.setAttribute('lang', lang);
  }

  let mobileOverlayOpen = false;
  function toggleMobileOverlay() {
    mobileOverlayOpen = !mobileOverlayOpen;
  }

  afterNavigate(() => {
    mobileOverlayOpen = false;
  });
</script>

<header class="sticky top-0 bg-bg-200">
  <div class="c-container">
    <div class="logo">
      <a href="/{lang}" title="Home" class="flex w-min items-center space-x-2">
        <span class="grid h-8 w-8 place-items-center bg-bg-300 text-2xs">Logo</span>
        <span class="w-max font-bold">Svelte Vietnam</span>
      </a>
    </div>
    <div class="theme relative grid place-items-center" aria-expanded={themeMenuOpen}>
      {#key colorScheme}
        <button
          class="hover:text-primary"
          on:click|stopPropagation={toggleThemeMenu}
          in:fade|local={{ duration: 150 }}
        >
          <ColorSchemeIcon scheme={SCHEMES[colorScheme].scheme} />
        </button>
      {/key}
      {#key themeMenuOpen}
        <div
          class="absolute top-full right-0 z-popup mt-1 flex flex-col items-end shadow-lg"
          class:hidden={!themeMenuOpen}
          transition:slide|local={{ duration: 150 }}
          use:clickoutside={{ enabled: themeMenuOpen }}
          on:clickoutside={toggleThemeMenu}
        >
          <div class="triangle mr-2 triangle-t triangle-bg-100" />
          <ul class="bg-bg-100 py-1">
            {#each Object.values(SCHEMES) as s}
              <li>
                <button
                  on:click={() => changeColorScheme(s.scheme)}
                  class="flex w-full items-center space-x-2 py-2 px-4 text-sm font-bold hover:bg-bg-200 hover:text-primary"
                  class:text-primary={colorScheme === s.scheme}
                >
                  <ColorSchemeIcon scheme={s.scheme} />
                  <span class="whitespace-nowrap">{t.colorScheme[s.scheme]}</span>
                </button>
              </li>
            {/each}
          </ul>
        </div>
      {/key}
    </div>
    <button class="mobile-open" on:click={toggleMobileOverlay}>
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_266_66)">
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
        </g>
        <defs>
          <clipPath id="clip0_266_66">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </button>
    {#key mobileOverlayOpen}
      <div
        class="mobile-wrapper"
        data-open={mobileOverlayOpen}
        transition:fly={{ duration: 200, x: 50 }}
      >
        <nav aria-label="languages" data-sveltekit-preload-data="hover" data-sveltekit-noscroll>
          <ul>
            {#each LANGUAGES as language, i}
              {@const current = language === lang}
              <li>
                <a
                  class="hover:text-primary aria-current:font-bold"
                  aria-current={current}
                  href={localizeUrl($page.url, language).toString()}
                  on:click={() => changeLanguage(language)}
                >
                  {language.toUpperCase()}
                </a>
              </li>
              {#if i < LANGUAGES.length - 1}
                <p class="" aria-disabled>|</p>
              {/if}
            {/each}
          </ul>
        </nav>
        <nav aria-label="pages" data-sveltekit-preload-data="hover">
          <ul>
            {#each Object.values(navLinks) as { text, href }}
              {@const current = href === $page.url.pathname}
              <li>
                <a class="hover:text-primary aria-current:font-bold" aria-current={current} {href}
                  >{text}</a
                >
              </li>
            {/each}
          </ul>
        </nav>
        <button class="mobile-close" on:click={toggleMobileOverlay}>
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_77_52)">
              <path
                d="M8.30002 25.0999L6.90002 23.6999L14.6 15.9999L6.90002 8.2999L8.30002 6.8999L16 14.5999L23.7 6.8999L25.1 8.2999L17.4 15.9999L25.1 23.6999L23.7 25.0999L16 17.3999L8.30002 25.0999Z"
              />
            </g>
            <defs>
              <clipPath id="clip0_77_52">
                <rect width="32" height="32" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>
    {/key}
  </div>
</header>

<style lang="postcss">
  header > div {
    display: grid;
    grid-template-areas: 'logo theme mobile-open';
    grid-template-columns: 1fr auto auto;
    column-gap: theme('spacing.4');
    align-items: center;

    height: theme('spacing.header');

    @screen md {
      grid-template-areas: 'logo pages theme languages';
      grid-template-columns: auto 1fr auto auto;
    }
  }

  .logo {
    grid-area: logo;
  }

  .theme {
    grid-area: theme;
  }

  nav[aria-label='languages'] {
    display: contents;

    & > ul {
      display: flex;
      grid-area: languages;
      align-items: center;

      @apply space-x-2;

      @media (max-width: theme('screens.md')) {
        font-size: theme('fontSize.xl');
      }
    }
  }

  nav[aria-label='pages'] {
    display: contents;

    & > ul {
      display: flex;
      grid-area: pages;
      align-items: center;
      justify-content: center;

      @media (max-width: theme('screens.md')) {
        flex-direction: column;
        margin-top: calc(-1 * theme('spacing.6'));
        font-size: theme('fontSize.2xl');

        @apply space-y-9;
      }

      @screen md {
        @apply space-x-4;

        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
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
