<script lang="ts">
  import { EventCard } from '$client/components/EventCard';
  import { MailRegistrationForm } from '$client/components/MailRegistrationForm';
  import { APP_ROUTE_TREE, EMAILS, SOCIAL_LINKS } from '$shared/constants';

  import type { ActionData } from './$types';

  export let data;
  export let form: ActionData;

  $: t = data.translations.page;
  $: tMail = data.translations.mail;

  $: sponsorHref = APP_ROUTE_TREE[':lang'].sponsor.$.path({
    args: {
      ':lang': data.language,
    },
  });
</script>

<main class="c-page">
  <section class="c-page@header">
    <h1 class="c-page@h1">{t.title}</h1>
    <p class="c-page@h1-sub">{t.subtitle}</p>
  </section>

  <section class="space-y-10">
    <h2 class="c-page@h2">{t.upcomingEvents.title}</h2>
    <ul class="space-y-10">
      {#each data.events.upcoming as event}
        <li>
          <EventCard {event} lang={data.language} />
        </li>
      {/each}
    </ul>
  </section>

  <div class="grid grid-cols-1 gap-10 md:grid-cols-2">
    <section class="c-action-card">
      <div class="c-graphic" />
      <h2 class="c-page@h2">{t.actions.share.title}</h2>
      <p>{t.actions.share.description}</p>
      <a href="mailto:{EMAILS.events}" class="c-btn">
        <span>
          {@html t.actions.share.cta}
        </span>
      </a>
    </section>

    <section class="c-action-card">
      <div class="c-graphic" />
      <h2 class="c-page@h2">{t.actions.participate.title}</h2>
      <p>{t.actions.participate.description}</p>
      <MailRegistrationForm
        t={tMail}
        name={form?.data?.name}
        nameError={form?.error?.form?.name?.[0]}
        email={form?.data?.email}
        emailError={form?.error?.form?.email?.[0]}
      />
    </section>

    <a
      href={SOCIAL_LINKS.discord}
      class="c-btn--outlined c-btn w-fit justify-self-center md:col-span-2"
    >
      {t.actions.discord.cta}
      <svg inline-src="simpleicon/discord" />
    </a>

    <section class="c-action-card md:col-span-2">
      <div class="c-graphic" />
      <h2 class="c-page@h2">{t.actions.sponsor.title}</h2>
      <p>{t.actions.sponsor.description}</p>
      <a href={sponsorHref} class="c-btn">{t.actions.sponsor.cta}</a>
      <a class="c-link text-xs italic" href="{sponsorHref}#why">
        {t.actions.sponsor.whyNeedSponsor}
      </a>
    </section>
  </div>

  <section class="space-y-10">
    <h2 class="c-page@h2">{t.pastEvents.title}</h2>
    <ul class="space-y-10">
      {#each data.events.past as event}
        <li>
          <EventCard {event} lang={data.language} />
        </li>
      {/each}
    </ul>
  </section>
</main>
