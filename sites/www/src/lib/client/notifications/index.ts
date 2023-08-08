import { store } from '@svelte-put/noti';

import Notification from './Notification.svelte';

export const notiStore = store({
  timeout: 5000,
})
  .variant('info', Notification)
  .variant('success', Notification)
  .variant('warning', Notification)
  .variant('error', Notification)
  .build();

export const noti = {
  info: (content: string) => notiStore.push('info', { props: { content } }),
  success: (content: string) => notiStore.push('success', { props: { content } }),
  warning: (content: string) => notiStore.push('warning', { props: { content } }),
  error: (content: string) => notiStore.push('error', { props: { content } }),
};
