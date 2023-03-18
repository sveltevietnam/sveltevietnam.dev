<script lang="ts">
  import { clickoutside } from '@svelte-put/clickoutside';
  import type { ResolveTrigger } from '@svelte-put/modal';
  import { shortcut } from '@svelte-put/shortcut';
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  import { GITHUB_LINKS } from '$shared/constants';

  import { WireframeVersionNoticeCache } from './WireframeVersionNotice.cache';

  const cache = new WireframeVersionNoticeCache();
  const shouldShow = cache.shouldShow;

  const dispatch = createEventDispatcher<{
    resolve: {
      trigger: ResolveTrigger;
    };
  }>();

  function escape() {
    dispatch('resolve', { trigger: 'escape' });
  }

  function clickOutside() {
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
    <p class="text-3xl font-bold">Under Construction</p>
    <svg data-inline-src="google/handyman" height="40" width="40" class="mx-auto" />
    <p>
      You are seeing the wireframe version of Svelte Vietnam. The project is in active design and
      development.
    </p>
    <p>
      For more information, see <a
        href={GITHUB_LINKS.PROJECT_REFERENCES}
        class="c-link"
        target="_blank"
        rel="noreferrer">Project References</a
      >. Roadmap and progress can be tracked at
      <a href={GITHUB_LINKS.PROJECT} class="c-link" target="_blank" rel="noreferrer"
        >sveltevietnam.dev project board</a
      >.
    </p>
    <p>
      We welcome any <a
        href={GITHUB_LINKS.DISCUSSION}
        class="c-link"
        target="_blank"
        rel="noreferrer">feedbacks and contributions</a
      >. Thank you for stopping by.
    </p>
    <div class="flex items-center justify-center space-x-4">
      <button on:click={takeIn} type="button" class="c-btn bg-bg-400 text-fg-400">Take me in</button
      >
      {#if shouldShow === true}
        <button on:click={doNotShowAgain} type="button" class="c-btn--outlined c-btn border-bg-400">
          Don't show again
        </button>
      {/if}
    </div>
  </div>
</div>
