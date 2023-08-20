<script lang="ts">
  import { intersect } from '$client/actions/intersect';
  import { splitFade } from '$client/actions/splitFade';
  import { AnimatedArrowCircle } from '$client/components/AnimatedArrowCircle';
  import { EventCard } from '$client/components/EventCard';
  import type { Language } from '$shared/services/i18n';
  import { EVENTS_PATH } from '$shared/services/navigation';
  import type { Event } from '$shared/types';

  import { translations } from '../translation';

  export let lang: Language;
  export let events: Event[];

  $: t = translations[lang].events;
</script>

<section class="events c-container-design">
  <a href={EVENTS_PATH} title={t.title} class="section-title-container" use:splitFade>
    <h2 class="section-title">
      {t.title}
    </h2>
    <AnimatedArrowCircle class="h-12 w-12 tb:h-16 tb:w-16" handle="parent" />
  </a>
  <p class="section-desc mt-6" use:intersect>{t.description}</p>
  <ul>
    {#each events as event}
      <li use:intersect>
        <EventCard {event} {lang} />
      </li>
    {/each}
  </ul>
</section>

<style lang="postcss">
  ul {
    margin-top: 40px;

    @screen sp {
      margin-left: 32px;
    }

    @screen tb {
      margin-top: 60px;
    }
  }
</style>
