<script lang="ts">
  import { EMAILS, SOCIAL_LINKS } from '$shared/constants';

  export let data;

  $: t = data.translations.page;
</script>

<main class="c-page">
  <section class="c-page@header">
    <h1 class="c-page@h1">{t.title}</h1>
  </section>

  <section>
    <h2 hidden>Introduction</h2>
    <p>{@html t.intro}</p>
  </section>

  <section class="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-10">
    <h2 hidden>Call to Action</h2>
    <a href={SOCIAL_LINKS.openCollective} class="c-btn h-24">{@html t.ctas.sponsor}</a>
    <a href="mailto:{EMAILS.sponsor}" class="c-btn c-btn--outlined h-24" external>
      <span>{@html t.ctas.question}</span>
    </a>
  </section>

  <section class="space-y-4">
    <h2 class="c-page@h2" id="why">{t.why.title}</h2>
    <p>{@html t.why.description}</p>
  </section>

  <a href={SOCIAL_LINKS.openCollective} external class="c-btn justify-self-center bg-bg-200"
    >{t.sponsors.cta}</a
  >
</main>
