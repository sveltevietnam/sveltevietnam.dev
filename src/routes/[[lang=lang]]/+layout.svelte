<script lang="ts">
  import ModalPortal from '@svelte-put/modal/ModalPortal.svelte';

  import { invalidate } from '$app/navigation';
  import { Footer } from '$client/components/Footer';
  import { Header } from '$client/components/Header';
  import { SplashScreen } from '$client/components/SplashScreen/index.js';
  import { modalStore } from '$client/modals';
  import { LOAD_DEPENDENCIES } from '$shared/constants';
  import type { ColorScheme } from '$shared/types';

  export let data;

  $: clientColorScheme = data.colorScheme;
  async function changeColorScheme(e: CustomEvent<ColorScheme>) {
    const scheme = e.detail;
    if (clientColorScheme === scheme) return;
    clientColorScheme = scheme;
    document.documentElement.dataset.colorScheme = scheme;
    await fetch('/api/color-scheme', {
      method: 'POST',
      body: scheme,
    });
    invalidate(LOAD_DEPENDENCIES.COLOR_SCHEME);
  }
</script>

<Header
  lang={data.language}
  colorScheme={clientColorScheme}
  on:colorSchemeChange={changeColorScheme}
/>

<slot />

<Footer lang={data.language} version={data.version} />

<ModalPortal store={modalStore} class="z-modal" />

<SplashScreen variant={data.splashScreenVariant} />
