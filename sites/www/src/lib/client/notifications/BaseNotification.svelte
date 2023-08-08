<script lang="ts" context="module">
  export type NotificationIntent = 'info' | 'success' | 'warning' | 'error';
</script>

<script lang="ts">
  import type { NotificationInstance } from '@svelte-put/noti';
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';

  export let notification: NotificationInstance;
  export let intent: NotificationIntent;

  const { progress } = notification;

  const dispatch = createEventDispatcher<{ resolve: undefined }>();
  const dismiss = () => dispatch('resolve');
</script>

<div
  class="notification notification--{intent}"
  in:fly|global={{ duration: 200, y: -20 }}
  on:mouseenter={progress.pause}
  on:mouseleave={progress.resume}
  role="presentation"
>
  <div class="icon">
    {#if intent === 'info'}
      <svg inline-src="google/info" width="24" height="24" />
    {:else if intent === 'success'}
      <svg inline-src="google/check-circle" width="24" height="24" />
    {:else if intent === 'warning'}
      <svg inline-src="google/warning" width="24" height="24" />
    {:else if intent === 'error'}
      <svg inline-src="google/error" width="24" height="24" />
    {/if}
  </div>
  <div class="content">
    <slot />
  </div>
  <button on:click={dismiss} type="button" class="dismiss-btn">
    <svg inline-src="icon/x" width="24" height="24" />
  </button>
  <div
    class="progress"
    class:paused={$progress.state === 'paused'}
    style={`--progress-duration: ${notification.timeout}ms;`}
  />
</div>

<style lang="postcss">
  .notification {
    --notification-color: theme('colors.design.bg.2');

    pointer-events: auto;

    position: relative;

    overflow: hidden;
    display: flex;
    gap: 16px;
    align-items: flex-start;

    min-width: 200px;
    padding: 16px;

    color: theme('colors.design.grayscale.dark.1');

    background-color: color-mix(in srgb, var(--notification-color) 20%, white 80%);
    border-radius: 4px;

    &.notification--info {
      --notification-color: theme('colors.status.info');
    }

    &.notification--success {
      --notification-color: theme('colors.status.success');
    }

    &.notification--warning {
      --notification-color: theme('colors.status.warning');
    }

    &.notification--error {
      --notification-color: theme('colors.status.error');
    }
  }

  .icon {
    fill: var(--notification-color);
  }

  .content {
    flex: 1;
  }

  .progress {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    transform-origin: left;

    height: 3px;

    background-color: var(--notification-color);

    animation: progress var(--progress-duration) linear;
  }

  .progress.paused {
    animation-play-state: paused;
  }

  @keyframes progress {
    from {
      transform: scaleX(0);
    }

    to {
      transform: scaleX(1);
    }
  }
</style>
