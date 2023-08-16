<script lang="ts">
  import { localizeUrl } from '@libs/utils/url';
  import ModalPortal from '@svelte-put/modal/ModalPortal.svelte';
  import { onMount } from 'svelte';

  import { version } from '$app/environment';
  import { beforeNavigate, goto } from '$app/navigation';
  import { Footer } from '$client/components/Footer';
  import { Header } from '$client/components/Header';
  import { SplashScreen } from '$client/components/SplashScreen/index.js';
  import { modalStore } from '$client/modals';
  import NotificationPortal from '$client/notifications/NotificationPortal.svelte';
  import { noti, notiStore } from '$client/notifications/index.js';
  import { PUBLIC_COOKIE_SCHEME, PUBLIC_DISCORD_WS_URL } from '$env/static/public';
  import { LANGUAGES } from '$shared/services/i18n/index.js';
  import type { ColorScheme } from '$shared/types';

  import PageTransition from './_page/components/PageTransition.svelte';

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
    try {
      const ws = new WebSocket(PUBLIC_DISCORD_WS_URL);
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
    } catch (e) {
      //
    }
  });

  beforeNavigate(({ to, cancel, from }) => {
    const fromLang = from?.params?.lang;
    const toLang = to?.params?.lang;
    if (to && fromLang && !toLang) {
      cancel();
      const localized = localizeUrl(to.url, fromLang, LANGUAGES);
      goto(localized);
    }
  });
</script>

<Header
  pathname={data.pathname}
  lang={data.language}
  colorScheme={clientColorScheme}
  on:colorSchemeChange={changeColorScheme}
/>

<PageTransition>
  <slot />
  <Footer lang={data.language} {version} pathname={data.pathname} />
</PageTransition>

<!-- portals -->
<ModalPortal store={modalStore} class="z-modal" />
<NotificationPortal store={notiStore} />

<SplashScreen variant={data.splashScreenVariant} />
