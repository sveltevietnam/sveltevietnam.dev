<script lang="ts">
  import { clickoutside } from '@svelte-put/clickoutside';
  import type { ResolveTrigger } from '@svelte-put/modal';
  import { shortcut } from '@svelte-put/shortcut';
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  import type { Language } from '$shared/services/i18n';

  import { WireframeVersionNoticeCache } from './WireframeVersionNotice.cache';
  import { translations } from './translation';

  export let lang: Language;
  $: t = translations[lang];

  const cache = new WireframeVersionNoticeCache();
  const shouldShow = cache.shouldShow;

  const dispatch = createEventDispatcher<{
    resolve: {
      trigger: ResolveTrigger;
    };
  }>();

  function escape() {
    cache.shouldShow = true;
    dispatch('resolve', { trigger: 'escape' });
  }

  function clickOutside() {
    cache.shouldShow = true;
    dispatch('resolve', { trigger: 'clickoutside' });
  }

  function takeIn() {
    cache.shouldShow = true;
    dispatch('resolve', { trigger: 'custom' });
  }

  function doNotShowAgain() {
    cache.shouldShow = false;
    dispatch('resolve', { trigger: 'custom' });
  }
</script>

<svelte:window use:shortcut={{ trigger: { key: 'Escape', callback: escape } }} />

<div class="relative grid h-full w-full place-items-center">
  <div
    aria-disabled
    class="absolute inset-0 -z-px backdrop-blur-sm"
    transition:fade={{ duration: 200 }}
  />
  <div
    class="mx-6 space-y-4 rounded bg-bg-300 p-6 text-center shadow-lg md:p-10"
    use:clickoutside
    on:clickoutside={clickOutside}
    transition:fly={{ duration: 200, y: 50 }}
  >
    <p class="text-3xl font-bold uppercase">{t.title}</p>
    <svg inline-src="google/handyman" height="40" width="40" class="mx-auto" />
    <p>
      {@html t.description}
    </p>
    <p>
      {@html t.feedbacks}
    </p>
    <div class="flex items-center justify-center space-x-4">
      <button on:click={takeIn} type="button" class="c-btn bg-bg-400 text-fg-400">
        {t.ctas.continue}
      </button>
      {#if shouldShow === true}
        <button on:click={doNotShowAgain} type="button" class="c-btn c-btn--outlined border-bg-400">
          {t.ctas.doNotShowAgain}
        </button>
      {/if}
    </div>
  </div>
</div>
