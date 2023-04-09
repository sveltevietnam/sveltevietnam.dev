<script lang="ts">
  import { EventCard } from '$client/components/EventCard';
  import { APP_ROUTE_TREE } from '$shared/constants';
  import type { Language } from '$shared/services/i18n';
  import type { Event } from '$shared/types';

  import { translations } from '../translation';

  export let lang: Language;
  export let events: Event[];

  $: t = translations[lang].events;

  $: eventsHref = APP_ROUTE_TREE[':lang'].$.path({
    args: {
      ':lang': lang,
    },
  });
</script>

<section class="events c-container-design">
  <div class="section-title-container">
    <h2 class="section-title">
      {t.title}
    </h2>
    <a href={eventsHref} title={t.title}>
      <svg inline-src="icon/arrow-circle" width="64" height="64" class="arrow-circle" />
    </a>
  </div>
  <p class="section-desc mt-6 pc:mt-8">{t.description}</p>
  <ul class="mt-10 pc:mt-20 sp:ml-8">
    {#each events as event}
      <li>
        <EventCard {event} {lang} />
      </li>
    {/each}
  </ul>
</section>
