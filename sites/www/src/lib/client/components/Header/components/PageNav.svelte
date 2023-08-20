<script lang="ts">
  import type { Language } from '$shared/services/i18n';
  import { HEADER_PATHS, getPathLabel, isCurrentPage } from '$shared/services/navigation';

  export let pathname: string;
  export let lang: Language;
  let cls = '';
  export { cls as class };
</script>

<nav aria-label="pages" data-sveltekit-preload-data="hover">
  <ul class="sp:divide-y sp:divide-design-border-1 {cls}">
    {#each HEADER_PATHS as href}
      {@const current = isCurrentPage(pathname, href)}
      <li>
        <a aria-current={current} {href} class="c-link c-link--preserved">
          {getPathLabel(href, lang)}
        </a>
      </li>
    {/each}
  </ul>
</nav>

<style lang="postcss">
  nav {
    display: contents;

    & > ul {
      @screen sp {
        align-self: flex-start;
        margin-top: 80px;
        margin-right: -16px;
        margin-left: -16px;
      }

      @screen tb {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        display: flex;
        gap: 16px;
        align-items: center;
        justify-content: center;
      }

      @screen pc {
        gap: 40px;
      }
    }

    & a {
      --underline-height: 2px;

      position: relative;

      display: block;

      font-size: 14px;
      text-transform: uppercase;
      white-space: nowrap;

      /* transition: color var(--transition-duration) var(--transition-timing-function); */

      @screen sp {
        padding: 16px;
        font-size: 32px;
        line-height: 1.5;
      }

      &:hover {
        color: var(--active-color);
      }

      &[aria-current]:not([aria-current='false']) {
        color: var(--active-color);
      }

      @media (768px <= width <= 850px) {
        font-size: calc(14 / 850 * 100vw);
      }
    }
  }
</style>
