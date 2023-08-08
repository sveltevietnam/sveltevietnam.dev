<script lang="ts">
  import type { NotificationInstance } from '@svelte-put/noti';

  import BaseNotification, { type NotificationIntent } from './BaseNotification.svelte';

  export let notification: NotificationInstance;
  export let intent: NotificationIntent;

  export let content = 'Placeholder';
</script>

<BaseNotification {notification} {intent} on:resolve>
  <p>{content}</p>
</BaseNotification>
