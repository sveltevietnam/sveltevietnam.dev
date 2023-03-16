---
to: src/lib/client/modals/<%=Name%>/<%=Name%>.svelte
unless_exists: true
---
<script lang="ts">
  import type { ResolveTrigger } from '@svelte-put/modal';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    resolve: {
      trigger: ResolveTrigger;
      payload: string;
    };
  }>();

  function resolve() {
    dispatch('resolve', { trigger: 'custom', payload: 'example' });
  }
</script>

<slot>

<style lang="postcss">

</style>
