<script lang="ts">
  import { page } from '$app/stores';
  import { LANGUAGES, localizeUrl } from '$shared/services/i18n';
  import type { Language } from '$shared/services/i18n';

  export let lang: Language;
  let cls = '';
  export { cls as class };

  function changeLanguage(lang: Language) {
    document.documentElement.setAttribute('lang', lang);
  }
</script>

<nav aria-label="languages" data-sveltekit-preload-data="hover" data-sveltekit-noscroll>
  <ul class={cls}>
    {#each LANGUAGES as language}
      {@const current = language === lang}
      <li>
        <a
          lang={language}
          aria-current={current}
          href={localizeUrl($page.url, language).toString()}
          on:click={() => changeLanguage(language)}
        >
          {language}
        </a>
      </li>
    {/each}
  </ul>
</nav>

<style lang="postcss">
  nav {
    display: contents;

    & > ul {
      display: flex;
      align-items: center;

      width: fit-content;
      height: 32px;

      border: 1px solid currentcolor;
      border-radius: 30px;

      @media (max-width: theme('screens.md')) {
        font-size: theme('fontSize.xl');
      }
    }

    & li:last-of-type {
      border-left: 1px solid theme('colors.design.fg.1');
    }

    & a {
      display: block;

      padding: 0 12px;

      font-size: 16px;
      font-weight: 500;
      line-height: normal;
      text-transform: uppercase;

      transition: opacity var(--transition-duration) var(--transition-timing-function);

      &[aria-current='false'] {
        color: currentcolor;
        opacity: 0.5;
      }

      &:hover {
        opacity: 1;
      }

      &[aria-current]:not([aria-current='false']) {
        color: var(--active-color);
      }
    }
  }
</style>
