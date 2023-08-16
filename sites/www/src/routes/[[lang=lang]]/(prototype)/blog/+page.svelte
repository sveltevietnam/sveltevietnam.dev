<script lang="ts">
  import { Breadcrumbs } from '$client/components/Breadcrumbs';

  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="c-container-design">
  <Breadcrumbs breadcrumbs={data.breadcrumbs} />
</div>

<main>
  <!-- blog listing -->
</main>
