<script lang="ts">
  import Breadcrumbs from '$client/components/Breadcrumbs/Breadcrumbs.svelte';
  import { EventCard } from '$client/components/EventCard';
  import { MailRegistrationForm } from '$client/components/MailRegistrationForm';
  import { EMAILS, SOCIAL_LINKS } from '$shared/constants';
  import { SPONSOR_PATH } from '$shared/services/navigation';

  export let data;

  $: t = data.translations.page;
  $: tMail = data.translations.mail;
</script>

<main class="c-container-design">
  <Breadcrumbs breadcrumbs={data.breadcrumbs} class="mt-6" />
  <section class="pt-6 tb:pt-[120px] tb:pb-[256px] tb:text-right">
    <h1 class="tp-h1 uppercase">{t.title}</h1>
    <p class="tp-h4 mt-6 tb:mt-8">{t.subtitle}</p>
  </section>
  <div class="space-y-[60px] tb:space-y-[120px] pb-[120px] tb:pb-40">
    <section>
      <h2 class="tp-h2 uppercase">{t.upcomingEvents.title}</h2>
      <ul class="mt-10 tb:mt-[60px] space-y-10 tb:space-y-[60px]">
        {#each data.events.upcoming as event}
          <li>
            <EventCard {event} lang={data.language} />
          </li>
        {/each}
      </ul>
    </section>
    <section>
      <h2 class="sr-only">{t.actions.title}</h2>
      <section class="action-card">
        <h2 class="tp-h3">{t.actions.share.title}</h2>
        <p>{t.actions.share.description}</p>
        <p>
          Email
          <a href="mailto:{EMAILS.events}" class="c-link">
            {EMAILS.events}
          </a>
        </p>
      </section>
      <section class="action-card"></section>
    </section>
    <!-- <div class="grid grid-cols-1 gap-10 md:grid-cols-2">
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
          language={data.language}
          colorScheme={data.colorScheme}
          superValidated={data.mailForm}
        />
      </section>

      <a
        href={SOCIAL_LINKS.discord}
        class="c-btn--with-icon c-btn c-btn--outlined w-fit justify-self-center md:col-span-2"
      >
        {t.actions.discord.cta}
        <svg inline-src="simpleicon/discord" />
      </a>

      <section class="c-action-card md:col-span-2">
        <div class="c-graphic" />
        <h2 class="c-page@h2">{t.actions.sponsor.title}</h2>
        <p>{t.actions.sponsor.description}</p>
        <a href={SPONSOR_PATH} class="c-btn">{t.actions.sponsor.cta}</a>
        <a class="c-link text-xs italic" href="{SPONSOR_PATH}#why">
          {t.actions.sponsor.whyNeedSponsor}
        </a>
      </section>
    </div> -->
    <section>
      <h2 class="tp-h2 uppercase">{t.pastEvents.title}</h2>
      <ul class="mt-10 tb:mt-[60px] space-y-10 tb:space-y-[60px]">
        {#each data.events.past as event}
          <li>
            <EventCard {event} lang={data.language} />
          </li>
        {/each}
      </ul>
    </section>
  </div>
</main>

<style lang="postcss">
  .action-card {
    padding: 24px;
    border: 1px solid currentcolor;
    border-radius: 20px;

    @space-y 24px;

    @screen tb {
      padding: 32px;
    }
  }
</style>
