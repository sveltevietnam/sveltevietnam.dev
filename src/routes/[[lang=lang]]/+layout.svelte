<script lang="ts">
  import { Footer } from '$client/components/organisms/Footer';
  import { Header } from '$client/components/organisms/Header';

  import type { PageData } from './$types';

  export let data: PageData;
</script>

<Header lang={data.language} />

<slot />

<Footer lang={data.language} />
