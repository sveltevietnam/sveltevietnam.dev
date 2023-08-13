<script lang="ts">
  import { delocalizeUrl } from '@libs/utils/url';
  import { cubicIn, cubicOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';

  import { afterNavigate, beforeNavigate, disableScrollHandling } from '$app/navigation';
  import { LANGUAGES } from '$shared/services/i18n';
  import { HOME_PATH, isCurrentPage } from '$shared/services/navigation';

  let key = 0;

  beforeNavigate(({ from, to }) => {
    if (from && to) {
      const deFrom = delocalizeUrl(from.url.pathname, LANGUAGES);
      const deTo = delocalizeUrl(to.url.pathname, LANGUAGES);
      if (deFrom !== deTo && deTo !== HOME_PATH) {
        key++;
      }
    }
  });

  let url: URL | undefined = undefined;
  afterNavigate(({ to }) => {
    disableScrollHandling();
    url = to?.url;
    if (to && isCurrentPage(to.url.pathname, HOME_PATH)) {
      autoScroll();
    }
  });

  const TRANSITION_DURATION = 300;
  const yIn = 12;
  const yOut = -12;

  function autoScroll() {
    //  https://github.com/sveltejs/kit/blob/8b27b177a160d7c9b8c1987ae49248eaf9c06258/packages/kit/src/runtime/client/client.js
    const deepLinked = url?.hash && document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (deepLinked) {
      // Here we use `scrollIntoView` on the element instead of `scrollTo`
      // because it natively supports the `scroll-margin` and `scroll-behavior`
      // CSS properties.
      deepLinked.scrollIntoView();
    } else {
      scrollTo(0, 0);
    }
  }
</script>

{#key key}
  <div
    in:fly={{
      y: yIn,
      duration: TRANSITION_DURATION,
      delay: TRANSITION_DURATION,
      easing: cubicOut,
    }}
    on:outroend={autoScroll}
    out:fly={{
      y: yOut,
      duration: TRANSITION_DURATION,
      easing: cubicIn,
    }}
  >
    <slot />
  </div>
{/key}
