<script lang="ts">
  import { localizeUrl } from '@internals/utils/url';
  import ModalPortal from '@svelte-put/modal/ModalPortal.svelte';
  import { onMount } from 'svelte';

  import { version } from '$app/environment';
  import { beforeNavigate, goto } from '$app/navigation';
  import { updated } from '$app/stores';
  import { Footer } from '$client/components/Footer';
  import { Header } from '$client/components/Header';
  import { SplashScreen } from '$client/components/SplashScreen/index.js';
  import { setColorSchemeContext } from '$client/contexts/colorScheme.js';
  import { modalStore } from '$client/modals';
  import NotificationPortal from '$client/notifications/NotificationPortal.svelte';
  import { noti, notiStore } from '$client/notifications/index.js';
  import { PUBLIC_DISCORD_WS_URL } from '$env/static/public';
  import { LANGUAGES } from '$shared/services/i18n/index.js';
  import { translations } from '$shared/services/i18n/translations/notification';

  export let data;

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

  $: if ($updated) noti.info(translations[data.language].newVersion);

  setColorSchemeContext(data.colorScheme);
</script>

<Header pathname={data.pathname} lang={data.language} />
<slot />
<Footer lang={data.language} {version} pathname={data.pathname} />

<!-- portals -->
<ModalPortal store={modalStore} class="z-modal" />
<NotificationPortal store={notiStore} />

<SplashScreen variant={data.splashScreenVariant} />
