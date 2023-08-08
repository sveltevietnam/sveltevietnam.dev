import { store } from '@svelte-put/noti';

import TextOnlyNotification from './TextOnlyNotification.svelte';

export const notiStore = store({
  timeout: 5000,
})
  .variant('text-only', TextOnlyNotification)
  .build();

export const noti = {
  info: (content: string) =>
    notiStore.push('text-only', {
      props: {
        content,
        intent: 'info',
      },
    }),
  success: (content: string) =>
    notiStore.push('text-only', {
      props: {
        content,
        intent: 'success',
      },
    }),
  warning: (content: string) =>
    notiStore.push('text-only', {
      props: {
        content,
        intent: 'warning',
      },
    }),
  error: (content: string) =>
    notiStore.push('text-only', {
      props: {
        content,
        intent: 'error',
      },
    }),
};
