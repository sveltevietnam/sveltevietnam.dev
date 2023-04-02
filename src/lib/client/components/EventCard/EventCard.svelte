<script lang="ts">
  import sponsorFallbackImg from '$shared/assets/images/fallback/sponsor.png';
  import type { Language } from '$shared/services/i18n';
  import type { Event } from '$shared/types';
  import { formatDate } from '$shared/utils/datetime';

  import { translations } from './translation';

  export let lang: Language;
  export let event: Event;
  let cls = '';
  export { cls as class };

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
  <p class="date">
    <time datetime={rStartDate.toISOString()}>{formatDate(rStartDate)}</time>
    <svg inline-src="icon/arrow-circle" width="32" height="32" />
  </p>
  <div class="content">
    <p class="title">{event.title}</p>
    <div class="geotime">
      <p class="geotime-item">
        <svg class="inline-block" height="24" width="24" inline-src="icon/map-pin" />
        <span>{event.location}</span>
      </p>
      <p class="geotime-item">
        <svg class="inline-block" height="24" width="24" inline-src="icon/clock" />
        <time datetime={rStartDate.toISOString()}>{formatTimeStr(event)}</time>
      </p>
    </div>
    <div class="my-4 h-px w-full bg-design-border-1 pc:my-8" aria-disabled />
    <div class="space-y-4">
      <p class="description">
        {@html event.description}
      </p>
      {#if event.speakers.length}
        <div class="highlights speakers">
          <p class="highlights-title">{t.speakers}</p>
          <ul>
            {#each event.speakers as { image, name, title, href }}
              <li>
                <svelte:element this={!!href ? 'a' : 'p'} {href}>
                  {name}
                </svelte:element>
                {#if title}
                  <p aria-disabled>-</p>
                  <p>
                    {@html title}
                  </p>
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      {#if event.sponsors.length}
        <div class="highlights sponsors">
          <p class="highlights-title">{t.sponsors}</p>
          <ul>
            {#each event.sponsors as { href, image, name }}
              <li>
                <svelte:element this={!!href ? 'a' : 'div'} {href} class="sponsor">
                  <img src={image || sponsorFallbackImg} width="32" height="32" alt={name} />
                  <p>{name}</p>
                </svelte:element>
              </li>{/each}
          </ul>
        </div>
      {/if}
    </div>
  </div>
</article>

<style lang="postcss">
  .event-card {
    display: flex;
    align-items: flex-start;

    @screen sp {
      @mixin space y, 24px;

      flex-direction: column;
    }

    @screen pc {
      @mixin space x, 131px;
    }
  }

  .date {
    @mixin space x, 4px;

    display: flex;
    font-family: theme('fontFamily.lora');
    font-size: 18px;

    @screen pc {
      @mixin space x, 8px;

      font-size: 24px;
    }

    & svg {
      width: 18px;
      height: 18px;

      @screen pc {
        width: 32px;
        height: 32px;
      }
    }
  }

  .content {
    @screen pc {
      max-width: 640px;
    }
  }

  .title {
    font-size: 18px;
    font-weight: 500;

    @screen pc {
      font-size: 24px;
    }
  }

  .geotime {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;

    margin-top: 12px;

    @screen pc {
      gap: 40px;
      margin-top: 16px;
    }
  }

  .geotime-item {
    @mixin space x, 4px;

    display: flex;
    align-items: center;

    @screen pc {
      @mixin space x, 8px;
    }
  }

  .highlights {
    @mixin space x, 8px;

    display: flex;
    font-size: 14px;

    @screen pc {
      @mixin space x, 24px;

      font-size: 16px;
    }

    & .highlights-title {
      flex-shrink: 0;
      width: 60px;
      font-weight: 500;
      white-space: nowrap;

      @screen pc {
        width: 70px;
      }
    }
  }

  .speakers {
    & ul {
      @mixin space y, 4px;
    }

    & li {
      @mixin space x, 4px;

      display: flex;
    }
  }

  .sponsors {
    & ul {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    & .sponsor {
      @mixin space x, 8px;

      display: flex;
      align-items: center;

      padding: 6px 8px;

      border: 1px solid theme('colors.design.border.1');
      border-radius: 25px;

      @screen pc {
        @mixin space x, 15px;

        padding: 6px 10px;
      }
    }
  }
</style>
