<script lang="ts">
  import { onMount } from 'svelte';

  import { modalStore } from '$client/modals';
  import { WireframeVersionNotice } from '$client/modals/WireframeVersionNotice';
  import { WireframeVersionNoticeCache } from '$client/modals/WireframeVersionNotice/WireframeVersionNotice.cache';

  export let data;

  onMount(() => {
    const cache = new WireframeVersionNoticeCache();
    if (cache.shouldShow !== false) {
      modalStore.push({
        component: WireframeVersionNotice,
        props: {
          lang: data.language,
        },
      });
    }
  });
</script>

<slot />
