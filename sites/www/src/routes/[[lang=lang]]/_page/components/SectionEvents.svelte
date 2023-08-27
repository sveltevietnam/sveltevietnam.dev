<script lang="ts">
  import { intersect } from '$client/actions/intersect';
  import { AnimatedArrowCircle } from '$client/components/AnimatedArrowCircle';
  import { ConsecutiveFadeUpIntro } from '$client/components/ConsecutiveFadeUpIntro';
  import { EventCard } from '$client/components/EventCard';
  import { SplitText } from '$client/components/SplitText';
  import type { Language } from '$shared/services/i18n';
  import { EVENTS_PATH } from '$shared/services/navigation';
  import type { Event } from '$shared/types';

  import { translations } from '../translation';

  export let lang: Language;
  export let events: Event[];

  $: t = translations[lang].events;
</script>

<section class="events c-container-design">
  <ConsecutiveFadeUpIntro selector=":is(.arrow, .char)">
    <a href={EVENTS_PATH} title={t.title} class="section-title-container">
      <h2 class=" tp-h2 uppercase">
        <SplitText text={t.title} />
      </h2>
      <AnimatedArrowCircle class="arrow h-12 w-12 tb:h-16 tb:w-16" handle="parent" />
    </a>
  </ConsecutiveFadeUpIntro>
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
