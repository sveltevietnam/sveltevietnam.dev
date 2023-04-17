<script lang="ts">
  import { intersect } from '$client/actions/intersect';
  import {
    animatedArrowCircleContainerClass,
    AnimatedArrowCircle,
  } from '$client/components/AnimatedArrowCircle';
  import { EventCard } from '$client/components/EventCard';
  import { APP_ROUTE_TREE } from '$shared/constants';
  import type { Language } from '$shared/services/i18n';
  import type { Event } from '$shared/types';

  import { translations } from '../translation';

  export let lang: Language;
  export let events: Event[];

  $: t = translations[lang].events;

  $: eventsHref = APP_ROUTE_TREE[':lang'].events.$.path({
    args: {
      ':lang': lang,
    },
  });
</script>

<section class="events c-container-design">
  <a
    href={eventsHref}
    title={t.title}
    class="section-title-container {animatedArrowCircleContainerClass}"
  >
    <h2 class="section-title">
      {t.title}
    </h2>
    <AnimatedArrowCircle class="h-12 w-12 tb:h-16 tb:w-16" />
  </a>
  <p class="section-desc mt-6 pc:mt-8" use:intersect>{t.description}</p>
  <ul class="mt-10 pc:mt-20 sp:ml-8">
    {#each events as event}
      <li use:intersect>
        <EventCard {event} {lang} />
      </li>
    {/each}
  </ul>
</section>
