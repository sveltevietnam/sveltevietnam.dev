<script lang="ts">
  import { AnimatedArrowCircle } from '$client/components/AnimatedArrowCircle';
  import { getLangContext } from '$client/contexts/lang';
  import defaultFallbackImg from '$shared/assets/images/fallback/default.webp';
  import sponsorFallbackImg from '$shared/assets/images/fallback/sponsor.webp';
  import type { Event } from '$shared/types';
  import { formatDate } from '$shared/utils/datetime';

  import { translations } from './translation';

  export let event: Event;
  let cls = '';
  export { cls as class };

  const langStore = getLangContext();
  $: lang = $langStore;

  $: t = translations[lang];
  $: rStartDate = new Date(event.startDate);
  // $: monthFormatter = new Intl.DateTimeFormat(lang, { month: 'long' });

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

<article class="event-card {cls}">
  <p class="tp-h4 font-medium flex items-center font-lora date">
    <time datetime={rStartDate.toISOString()}>{formatDate(rStartDate)}</time>
    <AnimatedArrowCircle height={32} width={32} handle="#{event.id}" />
  </p>
  <div class="flex-1">
    <a
      href={event.href}
      class="block transition-[color] duration-[400ms] hover:text-design-link-title title tp-h4 font-medium"
      id={event.id}
    >
      {event.title}
    </a>
    <p class="mt-6">
      {@html event.description}
    </p>
    <dl class="grid grid-cols-[auto,1fr] gap-y-3 mt-4 gap-x-6">
      <dt class="font-medium">{t.location}:</dt>
      <dd>
        {event.location}
      </dd>

      <dt class="font-medium">{t.time}:</dt>
      <dd>
        <time datetime={rStartDate.toISOString()}>{formatTimeStr(event)}</time>
      </dd>

      {#if event.speakers.length}
        <dt class="font-medium">{t.speakers}:</dt>
        <dd>
          <ul class="flex flex-wrap gap-y-3 gap-x-4 items-center">
            {#each event.speakers as { image, name, href }}
              <li>
                <svelte:element this={href ? 'a' : 'div'} {href} class="flex gap-x-2 items-center">
                  <img
                    src={image || defaultFallbackImg}
                    width="24"
                    height="24"
                    alt={name}
                    class="c-avatar"
                  />
                  <p>{name}</p>
                </svelte:element>
              </li>
            {/each}
          </ul>
        </dd>
      {/if}

      {#if event.sponsors.length}
        <dt class="font-medium">{t.sponsors}:</dt>
        <dd>
          <ul class="flex flex-wrap gap-y-3 gap-x-4 items-center">
            {#each event.sponsors as { href, image, name }}
              <li>
                <svelte:element this={href ? 'a' : 'div'} {href} class="flex gap-x-2 items-center">
                  <img src={image || sponsorFallbackImg} width="24" height="24" alt={name} />
                  <p>{name}</p>
                </svelte:element>
              </li>
            {/each}
          </ul>
        </dd>
      {/if}
    </dl>
  </div>
</article>

<style lang="postcss">
  .event-card {
    display: flex;
    align-items: flex-start;

    @screen sp {
      flex-direction: column;
      row-gap: 24px;
    }

    @screen tb {
      column-gap: clamp(50px, 10%, 118px);
      justify-content: space-between;
    }
  }

  .date {
    & :global(svg) {
      --animated-color: theme('colors.design.neutral.2');

      width: 18px;
      height: 18px;
      margin-left: 4px;

      @screen tb {
        width: 32px;
        height: 32px;
        margin-left: 8px;
      }
    }
  }
</style>
