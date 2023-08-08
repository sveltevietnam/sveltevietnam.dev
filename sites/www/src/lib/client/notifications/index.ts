import { store } from '@svelte-put/noti';

import type { Language } from '$shared/services/i18n';

import DiscordNotification from './DiscordNotification.svelte';
import TextOnlyNotification from './TextOnlyNotification.svelte';

export const notiStore = store({
  timeout: 5000,
})
  .variant('text-only', TextOnlyNotification)
  .variant('discord', DiscordNotification)
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
  discord: (props: { avatarURL: string; name: string; language: Language }) =>
    notiStore.push('discord', { props }),
};
