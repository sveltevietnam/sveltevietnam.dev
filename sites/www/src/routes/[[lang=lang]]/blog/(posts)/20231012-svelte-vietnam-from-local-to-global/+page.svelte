<script lang="ts">
  import { localizeBlogContent } from '$shared/data/blog';

  import type { PageData } from './$types';
  import { content } from './_page/data';

  export let data: PageData;

  $: component = localizeBlogContent(data.language, content);
</script>

<svelte:component this={component} />
