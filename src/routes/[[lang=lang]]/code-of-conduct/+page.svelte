<script lang="ts">
  import Info from '$client/components/icons/google/Info.svelte';
  import Discord from '$client/components/icons/simpleicons/Discord.svelte';
  import { EMAILS, SOCIAL_LINKS } from '$shared/constants';

  import type { PageData } from './$types';
  export let data: PageData;

  $: t = data.translations.page;
</script>

<main class="c-container">
  <section id="page-header">
    <h1 class="text-center text-6xl font-bold uppercase">{t.title}</h1>
  </section>

  <section class="notice">
    <h2 hidden>Description</h2>
    <Info height="24" width="24" class="notice-icon" />
    <p class="notice-description">{@html t.notice.description}</p>
    <p class="notice-action">{t.notice.action}</p>

    <div class="notice-ctas">
      <a href={SOCIAL_LINKS.discord} target="_blank" rel="noreferrer" class="c-btn">
        {t.notice.ctas.discord}
        <Discord width="24" height="24" class="max-md:h-4 max-md:w-4" />
      </a>
      <a href={EMAILS.coc} target="_blank" rel="noreferrer" class="c-btn" data-ctype="outline"
        >{t.notice.ctas.email}</a
      >
    </div>
  </section>

  <section class="space-y-10 py-20">
    <h2 hidden>Excerpt</h2>
    <p>{t.excerpt.intro}</p>
    <figure class="excerpt">
      <blockquote>
        <p>{@html t.excerpt.quote}</p>
      </blockquote>
      <figcaption>{@html t.excerpt.caption}</figcaption>
    </figure>
  </section>
</main>

<style lang="postcss">
  #page-header {
    display: grid;
    place-items: center;
    height: 600px;
  }

  .notice {
    display: grid;
    grid-template-areas:
      'icon description'
      'x action'
      'ctas ctas';
    row-gap: theme('spacing.4');
    column-gap: theme('spacing.4');

    padding: theme('spacing.6');

    background-color: theme('colors.bg.200');
    border-radius: theme('borderRadius.DEFAULT');

    @screen md {
      padding: theme('spacing.10');
    }

    & .notice-icon {
      grid-area: icon;
    }

    & .notice-description {
      grid-area: description;
    }

    & .notice-action {
      grid-area: action;
    }

    & .notice-ctas {
      display: flex;
      grid-area: ctas;

      @media (max-width: theme('screens.md')) {
        flex-direction: column;
        font-size: theme('fontSize.sm');

        @apply space-y-4;
      }

      @screen md {
        @apply space-x-8;

        align-items: center;
        justify-content: center;
      }
    }
  }

  .excerpt {
    display: grid;
    grid-template-areas:
      'line quote'
      'line caption';
    grid-template-columns: auto 1fr;
    row-gap: theme('spacing.6');
    column-gap: theme('spacing.4');

    &::before {
      content: '';

      display: grid;
      grid-area: line;

      width: 4px;
      height: 100%;

      background-color: theme('colors.fg.100');
    }

    & blockquote {
      grid-area: quote;

      & > p::first-letter {
        font-size: theme('fontSize.4xl');
        font-weight: theme('fontWeight.bold');
      }
    }

    & figcaption {
      grid-area: caption;
      padding-bottom: theme('spacing.2');
      font-style: italic;
    }
  }
</style>
