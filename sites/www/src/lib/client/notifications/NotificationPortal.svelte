<script lang="ts">
  import type { NotificationStore } from '@svelte-put/noti';
  import Notification from '@svelte-put/noti/Notification.svelte';
  import { flip } from 'svelte/animate';
  import { fly, fade } from 'svelte/transition';

  export let store: NotificationStore;
</script>

<!-- notification portal, typically setup at somewhere global like root layout -->
<aside class="notification-portal" role="log" aria-label="notifications">
  {#each $store.notifications as notification (notification.id)}
    <div animate:flip={{ duration: 200 }} in:fly={{ duration: 200 }} out:fade={{ duration: 120 }}>
      <Notification {notification} />
    </div>
  {/each}
</aside>

<style lang="postcss">
  .notification-portal {
    pointer-events: auto;

    position: fixed;
    z-index: theme('zIndex.notification');
    top: 8px;
    right: 8px;

    display: flex;
    flex-direction: column-reverse;
    gap: 16px;
    justify-content: flex-start;

    @screen upto-tb {
      left: 8px;
    }

    @screen tb {
      right: 8px;
      max-width: 560px;
    }
  }
</style>
