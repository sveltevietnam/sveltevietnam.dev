<script lang="ts">
  import type { Language } from '$shared/services/i18n';
  import type { Event } from '$shared/types';

  export let lang: Language;
  export let event: Event;
  let cls = '';
  export { cls as class };

  $: rStartDate = new Date(event.startDate);
  $: monthFormatter = new Intl.DateTimeFormat(lang, { month: 'long' });

  function formatTimeStr(event: Event) {
    const { startDate, endDate } = event;
    const start = new Date(startDate);
    const startYear = start.getFullYear();
    const startMonth = start.getMonth() + 1;
    const startDay = start.getDate();
    const startHour = start.getHours().toString().padStart(2, '0');
    const startMinute = start.getMinutes().toString().padStart(2, '0');

    const end = new Date(endDate);
    const endYear = end.getFullYear();
    const endMonth = end.getMonth() + 1;
    const endDay = end.getDate();
    const endHour = end.getHours().toString().padStart(2, '0');
    const endMinute = end.getMinutes().toString().padStart(2, '0');

    if (startYear === endYear && startMonth === endMonth && startDay === endDay) {
      return `${startHour}:${startMinute} - ${endHour}:${endMinute}`;
    } else if (startYear !== endYear) {
      return `${startYear}-${startMonth.toString().padStart(2, '0')}-${startDay
        .toString()
        .padStart(2, '0')} ${startHour}:${startMinute} - ${endYear}-${endMonth
        .toString()
        .padStart(2, '0')}-${endDay.toString().padStart(2, '0')} ${endHour}:${endMinute}`;
    } else {
      return `${startMonth.toString().padStart(2, '0')}-${startDay
        .toString()
        .padStart(2, '0')} ${startHour}:${startMinute} - ${endMonth
        .toString()
        .padStart(2, '0')}-${endDay.toString().padStart(2, '0')} ${endHour}:${endMinute}`;
    }
  }
</script>

<article class="event-card space-y-6 {cls}">
  <section class="flex max-md:flex-col max-md:space-y-10 md:items-center md:space-x-10">
    <div
      class="flex w-32 shrink-0 flex-col items-center justify-center space-y-1 rounded border border-fg-100 text-center square max-md:self-center"
    >
      <p class="text-2xl">{rStartDate.getDate()}</p>
      <p class="text-xl font-bold">{monthFormatter.format(rStartDate)}</p>
      <p>{rStartDate.getFullYear()}</p>
    </div>

    <div class="space-y-2">
      <p class="text-2xl font-bold">{event.title}</p>
      <p class="flex items-center space-x-2">
        <svg class="inline-block" height="16" width="16" inline-src="google/location-on" />
        <em>
          {event.location}
        </em>
      </p>
      <p class="flex items-center space-x-2">
        <svg class="inline-block" height="16" width="16" inline-src="google/schedule" />
        <em>
          <time datetime={rStartDate.toISOString()}>{formatTimeStr(event)}</time>
        </em>
      </p>
    </div>
  </section>

  <p>{event.description}</p>

  {#if event.highlights.length}
    <section class="space-y-4">
      <p class="text-xl font-bold">Highlights</p>
      <ul class="grid w-fit grid-cols-[auto,1fr] items-center gap-4 md:grid-cols-[auto,auto,auto]">
        {#each event.highlights as { image, title, description }}
          <li class="contents">
            {#if image}
              <!-- <img
                src={image}
                alt={title}
                class="aspect-square object-contain"
                height="50"
                width="50"
              /> -->
              <div class="c-avatar" />
            {:else}
              <div aria-disabled />
            {/if}
            <p class="font-medium">{title}</p>
            <p class="max-md:hidden">{description}</p>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if event.sponsors.length}
    <section class="space-y-4">
      <p class="text-xl font-bold">Sponsors</p>
      <ul class="flex max-md:flex-col max-md:space-y-4 md:items-center md:space-x-4">
        {#each event.sponsors as { href, image, name }}
          <li>
            <a {href} title={name}>
              {@html image}
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  <a href={event.href} class="c-btn c-btn--text w-fit">
    <span>View Details</span>
    <svg height="16" width="16" inline-src="google/arrow-right-alt" />
  </a>
</article>

<style lang="postcss">
  .event-card {
    padding: theme('spacing.10');
    background: theme('colors.bg.200');
    border-radius: theme('borderRadius.DEFAULT');
  }
</style>
