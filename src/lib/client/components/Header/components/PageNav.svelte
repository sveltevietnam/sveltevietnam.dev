<script lang="ts">
  import { page } from '$app/stores';
  import { APP_ROUTE_TREE } from '$shared/constants';
  import type { Language } from '$shared/services/i18n';

  import { translations } from '../translation';

  export let lang: Language;
  let cls = '';
  export { cls as class };

  $: t = translations[lang].navigation;

  $: navLinks = {
    events: {
      text: t.events,
      href: APP_ROUTE_TREE[':lang'].events.$.path({ args: { ':lang': lang } }),
    },
    jobs: {
      text: t.jobs,
      href: APP_ROUTE_TREE[':lang'].jobs.$.path({ args: { ':lang': lang } }),
    },
    impact: {
      text: t.impact,
      href: APP_ROUTE_TREE[':lang'].impact.$.path({ args: { ':lang': lang } }),
    },
    people: {
      text: t.people,
      href: APP_ROUTE_TREE[':lang'].people.$.path({ args: { ':lang': lang } }),
    },
    sponsor: {
      text: t.sponsor,
      href: APP_ROUTE_TREE[':lang'].sponsor.$.path({ args: { ':lang': lang } }),
    },
  };
</script>

<nav aria-label="pages" data-sveltekit-preload-data="hover">
  <ul class="sp:divide-y sp:divide-design-border-1 {cls}">
    {#each Object.values(navLinks) as { text, href }}
      {@const current = href === $page.url.pathname}
      <li>
        <a aria-current={current} {href}>
          <svg
            width="89"
            height="37"
            viewBox="0 0 89 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M60.9314 4.74446C53.3075 2.11553 45.3514 1 37.2858 1C32.6549 1 27.7277 1.54995 23.2556 2.77977C20.9878 3.40343 18.7049 3.93257 16.4948 4.74446C14.231 5.57606 11.7651 5.8552 9.54909 6.82471C7.28482 7.81533 3.74571 9.49971 2.90383 12.0253C1.90265 15.0289 -0.250654 18.173 1.96772 21.19C5.1481 25.5153 10.4455 27.6109 15.1889 29.7191C19.1086 31.4612 23.3364 31.8157 27.4393 32.9203C31.2149 33.9369 35.3239 33.5393 39.1349 34.4921C41.0116 34.9613 43.0825 34.7172 45.0059 34.9544C47.2686 35.2333 49.3963 35.5322 51.6858 35.5322C54.0938 35.5322 56.5017 35.607 58.8973 35.3704C61.4265 35.1206 63.8769 34.7866 66.3862 34.4459C70.6008 33.8735 74.4959 32.3904 78.2899 30.4934C81.3546 28.9611 85.4992 26.9548 86.7265 23.4667C87.7362 20.5972 88.2071 17.2251 86.218 14.6834C83.5812 11.3142 79.6781 8.9507 75.4469 8.23466C73.4775 7.90137 71.6235 7.86484 69.6222 7.86484C68.1606 7.86484 66.7415 8.28089 65.2999 8.28089"
              stroke="currentcolor"
              stroke-linecap="round"
              stroke-dashoffset="1"
              stroke-dasharray="1"
              pathLength="1"
            />
          </svg>
          <span>
            {text}
          </span>
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
        align-items: center;
        justify-content: center;

        @space-x theme('spacing.4');
      }

      @screen pc {
        @space-x theme('spacing.10');
      }
    }

    & a {
      position: relative;

      display: block;

      font-size: 14px;
      text-transform: uppercase;
      white-space: nowrap;

      transition: color var(--transition-duration) var(--transition-timing-function);

      @screen sp {
        padding: 16px;
        font-size: 32px;
      }

      & svg {
        position: absolute;
        z-index: -1;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        width: calc(100% + 20px);
        height: auto;

        @screen sp {
          display: none;
        }

        @screen pc {
          width: calc(100% + 40px);
        }

        & path {
          opacity: 0;

          stroke-dashoffset: 1;

          transition-timing-function: var(--transition-timing-function);
          transition-duration: var(--transition-duration);
          transition-property: stroke-dashoffset, opacity;
        }
      }

      &:hover {
        color: var(--active-color);
      }

      &[aria-current]:not([aria-current='false']) {
        color: var(--active-color);

        & path {
          opacity: 1;
          stroke-dashoffset: 0;
        }
      }
    }
  }
</style>
