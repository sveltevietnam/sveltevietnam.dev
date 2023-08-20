<script lang="ts">
  import { localizeUrl } from '@libs/utils/url';

  import { invalidate } from '$app/navigation';
  import { LOAD_DEPENDENCIES } from '$shared/constants';
  import { LANGUAGES } from '$shared/services/i18n';
  import type { Language } from '$shared/services/i18n';

  export let pathname: string;
  export let lang: Language;
  let cls = '';
  export { cls as class };

  function changeLanguage(lang: Language) {
    if (lang !== document.documentElement.getAttribute('lang')) {
      invalidate(LOAD_DEPENDENCIES.LANGUAGE);
      document.documentElement.setAttribute('lang', lang);
    }
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
          href={localizeUrl(pathname, language, LANGUAGES).toString()}
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
      height: 35px;

      font-size: 16px;
      font-weight: 500;
      line-height: normal;

      border: 1px solid currentcolor;
      border-radius: 30px;

      @screen upto-tb {
        height: 40px;
        font-size: theme('fontSize.xl');
      }
    }

    & li:last-of-type {
      border-left: 1px solid theme('colors.design.fg.1');
    }

    & a {
      display: block;
      padding: 0 12px;
      text-transform: uppercase;
      transition: opacity var(--transition-duration) var(--transition-timing-function);

      @screen upto-tb {
        padding: 0 16px;
      }

      &[aria-current='false'] {
        color: currentcolor;
        opacity: 0.6;
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
