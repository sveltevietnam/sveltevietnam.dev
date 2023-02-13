<script lang="ts">
  import { fly } from 'svelte/transition';

  import { page } from '$app/stores';
  import { APP_ROUTE_TREE } from '$shared/constants';
  import { localizeUrl, type Language, LANGUAGES } from '$shared/services/i18n';
  import { translations } from '$shared/services/i18n/translations/header';

  export let lang: Language;

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

  let mobileOpen = false;
  function toggleMobileOverlay() {
    mobileOpen = !mobileOpen;
  }
</script>

<header class="sticky top-0 bg-bg-200">
  <div class="c-container">
    <div class="logo">
      <a href="/{lang}" title="Home" class="flex w-min items-center space-x-2">
        <span class="grid h-8 w-8 place-items-center bg-bg-300 text-2xs">Logo</span>
        <span class="w-max font-bold">Svelte Vietnam</span>
      </a>
    </div>
    <div class="theme">
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_75_534)">
          <path
            d="M18.825 8.9L17.725 6.55L15.375 5.45L17.725 4.35L18.825 2L19.9249 4.35L22.275 5.45L19.9249 6.55L18.825 8.9ZM20.9249 16.125L20.1749 14.55L18.6 13.8L20.1749 13.05L20.9249 11.475L21.6749 13.05L23.25 13.8L21.6749 14.55L20.9249 16.125ZM7.84995 22L7.59995 19.7C7.36662 19.6667 7.12495 19.5917 6.87495 19.475C6.62495 19.3583 6.40828 19.2167 6.22495 19.05L4.27495 19.875L2.07495 16.275L3.97495 15.025C3.89162 14.7417 3.84995 14.4917 3.84995 14.275C3.84995 14.0583 3.89162 13.8083 3.97495 13.525L2.07495 12.275L4.27495 8.675L6.22495 9.5C6.40828 9.33333 6.62495 9.19167 6.87495 9.075C7.12495 8.95833 7.36662 8.88333 7.59995 8.85L7.84995 6.55H12.05L12.3 8.85C12.5333 8.88333 12.775 8.95833 13.025 9.075C13.275 9.19167 13.4916 9.33333 13.675 9.5L15.625 8.675L17.825 12.275L15.925 13.525C16.0083 13.8083 16.05 14.0583 16.05 14.275C16.05 14.4917 16.0083 14.7417 15.925 15.025L17.825 16.275L15.625 19.875L13.675 19.05C13.4916 19.2167 13.275 19.3583 13.025 19.475C12.775 19.5917 12.5333 19.6667 12.3 19.7L12.05 22H7.84995ZM9.94995 17.15C10.7833 17.15 11.4708 16.8792 12.0125 16.3375C12.5541 15.7958 12.825 15.1083 12.825 14.275C12.825 13.4417 12.5541 12.7542 12.0125 12.2125C11.4708 11.6708 10.7833 11.4 9.94995 11.4C9.11662 11.4 8.42912 11.6708 7.88745 12.2125C7.34578 12.7542 7.07495 13.4417 7.07495 14.275C7.07495 15.1083 7.34578 15.7958 7.88745 16.3375C8.42912 16.8792 9.11662 17.15 9.94995 17.15ZM9.94995 15.65C9.54995 15.65 9.22078 15.5208 8.96245 15.2625C8.70412 15.0042 8.57495 14.675 8.57495 14.275C8.57495 13.875 8.70412 13.5458 8.96245 13.2875C9.22078 13.0292 9.54995 12.9 9.94995 12.9C10.35 12.9 10.6791 13.0292 10.9375 13.2875C11.1958 13.5458 11.325 13.875 11.325 14.275C11.325 14.675 11.1958 15.0042 10.9375 15.2625C10.6791 15.5208 10.35 15.65 9.94995 15.65ZM9.09995 20.5H10.8L11 18.6C11.4833 18.4833 11.925 18.3167 12.325 18.1C12.725 17.8833 13.0916 17.6 13.425 17.25L15.05 17.975L15.875 16.675L14.325 15.575C14.5083 15.1583 14.6 14.725 14.6 14.275C14.6 13.825 14.5083 13.3917 14.325 12.975L15.875 11.875L15.05 10.575L13.425 11.3C13.0916 10.95 12.725 10.6667 12.325 10.45C11.925 10.2333 11.4833 10.0667 11 9.95L10.8 8.05H9.09995L8.89995 9.95C8.41662 10.0667 7.97495 10.2333 7.57495 10.45C7.17495 10.6667 6.80828 10.95 6.47495 11.3L4.84995 10.575L4.02495 11.875L5.57495 12.975C5.39162 13.3917 5.29995 13.825 5.29995 14.275C5.29995 14.725 5.39162 15.1583 5.57495 15.575L4.02495 16.675L4.84995 17.975L6.47495 17.25C6.80828 17.6 7.17495 17.8833 7.57495 18.1C7.97495 18.3167 8.41662 18.4833 8.89995 18.6L9.09995 20.5Z"
          />
        </g>
        <defs>
          <clipPath id="clip0_75_534">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
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
    {#key mobileOpen}
      <div class="mobile-wrapper" data-open={mobileOpen} transition:fly={{ duration: 200, x: 50 }}>
        <nav aria-label="languages" data-sveltekit-preload-data="hover" data-sveltekit-noscroll>
          <ul>
            {#each LANGUAGES as language, i}
              {@const current = language === lang}
              <li>
                <a
                  class="aria-current:font-bold"
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
                <a class="hover:font-medium aria-current:font-bold" aria-current={current} {href}
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
    grid-gap: theme('spacing.2');
    grid-template-areas: 'logo theme mobile-open';
    grid-template-columns: 1fr auto auto;
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
      }
    }
  }

  .mobile-wrapper {
    position: fixed;
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
