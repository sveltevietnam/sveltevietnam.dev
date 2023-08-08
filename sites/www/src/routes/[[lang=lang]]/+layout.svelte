<script lang="ts">
  import ModalPortal from '@svelte-put/modal/ModalPortal.svelte';
  import { onMount } from 'svelte';

  import { Footer } from '$client/components/Footer';
  import { Header } from '$client/components/Header';
  import { SplashScreen } from '$client/components/SplashScreen/index.js';
  import { modalStore } from '$client/modals';
  import NotificationPortal from '$client/notifications/NotificationPortal.svelte';
  import { noti, notiStore } from '$client/notifications/index.js';
  import { PUBLIC_COOKIE_SCHEME } from '$env/static/public';
  import type { ColorScheme } from '$shared/types';

  export let data;

  $: clientColorScheme = data.colorScheme;
  async function changeColorScheme(e: CustomEvent<ColorScheme>) {
    const scheme = e.detail;
    if (clientColorScheme === scheme) return;
    clientColorScheme = scheme;
    document.documentElement.dataset.colorScheme = scheme;
    document.cookie = `${PUBLIC_COOKIE_SCHEME}=${scheme}; path=/; SameSite=Lax; Secure`;
  }

  type DiscordEventData = {
    type: 'message';
    data: {
      avatarURL: string;
      name: string;
    };
  };

  // FIXME: extract to own service
  onMount(() => {
    const ws = new WebSocket('ws://localhost:5006/websocket');
    ws.addEventListener('message', (event) => {
      try {
        const payload = JSON.parse(event.data) as DiscordEventData;
        if (payload.type === 'message') {
          noti.discord({
            ...payload.data,
            language: data.language,
          });
        }
      } catch (error) {
        console.error(error);
      }
    });
    return () => {
      ws.close();
    };
  });
</script>

<Header
  lang={data.language}
  colorScheme={clientColorScheme}
  on:colorSchemeChange={changeColorScheme}
/>
<slot />
<Footer lang={data.language} version={data.version} />

<!-- portals -->
<ModalPortal store={modalStore} class="z-modal" />
<NotificationPortal store={notiStore} />

<SplashScreen variant={data.splashScreenVariant} />
