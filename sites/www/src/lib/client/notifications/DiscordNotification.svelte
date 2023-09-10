<script lang="ts" context="module">
  import { SOCIAL_LINKS } from '$shared/constants';
  import { translations as commonT } from '$shared/services/i18n/translations/common';
  export const translations = {
    en: {
      message: 'is having a conversation at',
    },
    vi: {
      message: 'vừa nhắn tin tại',
    },
  };
</script>

<script lang="ts">
  import type { NotificationInstance } from '@svelte-put/noti';

  import type { Language } from '$shared/services/i18n';

  import BaseNotification from './BaseNotification.svelte';

  export let notification: NotificationInstance;
  export let avatarURL: string;
  export let name: string;
  export let language: Language;
</script>

<BaseNotification {notification} intent="info" on:resolve icon={false}>
  <div class="wrapper">
    <img src={avatarURL} alt="discord profile" class="c-avatar" width="28" height="28" />
    <p>
      <strong>{name}</strong>
      {translations[language].message}
      <a href={SOCIAL_LINKS.discord} class="c-link" target="_blank" rel="noreferrer"
        >{commonT[language].sveltevienam} Discord</a
      >.
    </p>
  </div>
</BaseNotification>

<style>
  .wrapper {
    display: flex;
    gap: 16px;
    align-items: center;
  }
</style>
