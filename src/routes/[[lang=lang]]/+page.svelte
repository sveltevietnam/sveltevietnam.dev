<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  $: t = data.translations.page;
</script>

<h1>SVELTE VIETNAM</h1>

<main class="h-screen">
  <section id="introduction">
    <h2 hidden>Introduction</h2>
    <article>
      <p>Svelte</p>
      <p>{t.introduction.svelte}</p>
    </article>
    <article>
      <p>Vietnam</p>
      <p>{t.introduction.vietnam}</p>
    </article>
    <article>
      <p>Svelte Vietnam</p>
      <p>{t.introduction.svelteVietnam}</p>
    </article>
  </section>

  <section id="community">
    <h2>{t.community.title}</h2>
    <p>{t.community.description}</p>
  </section>
</main>