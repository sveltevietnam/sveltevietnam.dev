<script lang="ts">
  import { ContributorCard } from '$client/components/ContributorCard';
  import { GITHUB_LINKS } from '$shared/constants';

  export let data;

  $: t = data.translations.page;
</script>

<main class="c-page">
  <section class="c-page@header">
    <h1 class="c-page@h1">{t.title}</h1>
    <p class="c-page@h1-sub">{t.subtitle}</p>
  </section>

  <div class="actions">
    <section class="c-action-card">
      <h2 class="c-page@h2 justify-self-start">{t.who.title}</h2>
      <p class="text-left">{@html t.who.description}</p>
      <a
        href={GITHUB_LINKS.ISSUE.CONTRIBUTOR_NOMINATION}
        rel="noreferrer"
        target="_blank"
        class="c-btn">{t.who.cta}</a
      >
    </section>

    <section class="c-action-card">
      <h2 class="font-bold">{t.how.title}</h2>
      <ol>
        <li>
          <svg class="marker" inline-src="google/volunteer-activism" />
          <p class="text">{t.how.steps.contribute}</p>
        </li>
        <li>
          <svg class="marker" inline-src="google/thumb-up" />
          <p>{t.how.steps.nominate}</p>
        </li>
        <li>
          <svg class="marker" inline-src="google/verified" />
          <p>{t.how.steps.verify}</p>
        </li>
        <li>
          <svg class="marker" inline-src="google/social-leaderboard" />
          <p>{t.how.steps.recognize}</p>
        </li>
      </ol>
    </section>
  </div>

  <ul class="grid grid-cols-1 gap-10 md:grid-cols-2">
    {#each data.contributors as contributor}
      <ContributorCard {contributor} />
    {/each}
  </ul>
</main>

<style lang="postcss">
  .actions {
    display: grid;
    grid-template-columns: 1fr;
    gap: theme('spacing.10');

    @screen md {
      grid-template-columns: 1fr auto;
    }
  }

  li {
    display: grid;
    grid-template-areas:
      'up up'
      'left right'
      'down down';
    grid-template-columns: auto 1fr;
    grid-template-rows: repeat(3, auto);
    column-gap: theme('spacing.4');

    &::before,
    &::after {
      content: '';

      display: block;

      height: theme('spacing.6');

      border-color: theme('colors.bg.300');
      border-style: solid;
    }

    &::before {
      grid-area: up;
    }

    &::after {
      grid-area: down;
    }

    &:first-child {
      grid-template-areas:
        'left right'
        'down down';
      grid-template-rows: repeat(2, auto);

      &::before {
        content: none;
      }
    }

    &:last-child {
      grid-template-areas:
        'up up'
        'left right';
      grid-template-rows: repeat(2, auto);

      &::after {
        content: none;
      }
    }

    & > .marker {
      display: block;
      grid-area: left;
    }

    & > .text {
      grid-area: right;
    }

    &:nth-child(odd) {
      &::before {
        margin: 0 theme('spacing.3');
        border-top-width: 2px;
        border-left-width: 2px;
      }

      &::after {
        margin: 0 theme('spacing.3');
        border-bottom-width: 2px;
        border-left-width: 2px;
      }
    }

    &:nth-child(even) {
      &::before {
        margin-right: theme('spacing.3');
        border-right-width: 2px;
      }

      &::after {
        margin-right: theme('spacing.3');
        border-right-width: 2px;
      }

      & > .marker {
        grid-area: right;
        justify-self: flex-end;
      }
    }
  }
</style>
