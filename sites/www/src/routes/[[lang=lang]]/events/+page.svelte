<script lang="ts">
  import { intersect } from '$client/actions/intersect';
  import { Breadcrumbs } from '$client/components/Breadcrumbs';
  import ConsecutiveFadeUpIntro from '$client/components/ConsecutiveFadeUpIntro/ConsecutiveFadeUpIntro.svelte';
  import { EventCard } from '$client/components/EventCard';
  import { MailRegistrationForm } from '$client/components/MailRegistrationForm';
  import { SplitText } from '$client/components/SplitText';
  import { ToBeAnnounced } from '$client/components/ToBeAnnounced';
  import { EMAILS, SOCIAL_LINKS } from '$shared/constants';
  import { SPONSOR_PATH } from '$shared/services/navigation';

  import keyVisuals from './_page/images/key-visuals.svg';

  export let data;

  $: t = data.translations.page;
  $: tMail = data.translations.mail;
</script>

<main class="c-container-design">
  <div class="mt-6" use:intersect>
    <Breadcrumbs breadcrumbs={data.breadcrumbs} />
  </div>
  <section
    class="tb:flex tb:justify-between tb:flex-row-reverse mt-8 mb-[60px] tb:mt-[60px] tb:mb-[120px]"
    use:intersect
  >
    <div class="tb:text-right tb:mt-10 tb:max-w-[500px]">
      <h1 class="tp-h1 uppercase">{t.title}</h1>
      <p class="tp-h4 mt-6 tb:mt-8">{t.subtitle}</p>
    </div>
    <div class="sp:mt-8">
      <img
        src={keyVisuals}
        alt="people meet together through events"
        width="544"
        height="352"
        class="w-full h-auto max-w-[544px]"
      />
    </div>
  </section>
  <div class="space-y-[60px] tb:space-y-[120px] pb-[120px] tb:pb-40">
    <section>
      <ConsecutiveFadeUpIntro selector=".char">
        <h2 class="tp-h2 uppercase">
          <SplitText text={t.upcomingEvents.title} />
        </h2>
      </ConsecutiveFadeUpIntro>
      <div class="mt-10 tb:mt-[60px]">
        {#if data.events.past.length}
          <ul class="space-y-10 tb:space-y-[60px]">
            {#each data.events.upcoming as event}
              <li use:intersect>
                <EventCard {event} lang={data.language} />
              </li>
            {/each}
          </ul>
        {:else}
          <div use:intersect>
            <ToBeAnnounced>
              <p class="text-center">
                {t.upcomingEvents.tba.description}
                <a href="#mail" class="c-link">{t.upcomingEvents.tba.cta}</a>
              </p>
            </ToBeAnnounced>
          </div>
        {/if}
      </div>
    </section>
    <section class="">
      <h2 class="sr-only">{t.actions.title}</h2>
      <div
        class="grid sp:grid-rows-3 tb:grid-cols-2 tb-to-pc:grid-rows-2 gap-8 tb:gap-6 pc:grid-cols-3"
      >
        <section class="action-card" use:intersect>
          <h3 class="tp-h3">{t.actions.share.title}</h3>
          <div class="flex-1 mt-6 space-y-1">
            <p>{t.actions.share.description}</p>
            <p>{t.actions.share.call}</p>
          </div>
          <p>
            Email
            <a href="mailto:{EMAILS.events}" class="c-link">
              {EMAILS.events}
            </a>
          </p>
        </section>
        <section class="action-card" use:intersect id="mail">
          <h3 class="tp-h3">{t.actions.participate.title}</h3>
          <p class="flex-1 mt-6">{t.actions.participate.description}</p>
          <MailRegistrationForm
            t={tMail}
            language={data.language}
            colorScheme={data.colorScheme}
            superValidated={data.mailForm}
            class="mt-6"
          />
        </section>
        <section class="action-card" use:intersect>
          <h3 class="tp-h3">{t.actions.sponsor.title}</h3>
          <p class="flex-1 mt-6">{t.actions.sponsor.description}</p>
          <a class="c-link text-xs w-fit" href="{SPONSOR_PATH}#why">
            {t.actions.sponsor.whyNeedSponsor}
          </a>
          <a href={SPONSOR_PATH} class="c-btn mt-2 w-fit">{t.actions.sponsor.cta}</a>
        </section>
        <p
          class="text-center self-center pc:col-span-3 sp:w-8/12 justify-self-center"
          use:intersect
        >
          {t.actions.discord}
          <a href={SOCIAL_LINKS.discord} class="c-link" target="_blank" rel="noreferrer">
            Svelte Vietnam Discord
          </a>
        </p>
      </div>
    </section>
    <section>
      <ConsecutiveFadeUpIntro selector=".char">
        <h2 class="tp-h2 uppercase">
          <SplitText text={t.pastEvents.title} />
        </h2>
      </ConsecutiveFadeUpIntro>
      <div class="mt-10 tb:mt-[60px]">
        {#if data.events.past.length}
          <ul class="space-y-10 tb:space-y-[60px]">
            {#each data.events.past as event}
              <li use:intersect>
                <EventCard {event} lang={data.language} />
              </li>
            {/each}
          </ul>
        {:else}
          <div use:intersect>
            <ToBeAnnounced>
              <p class="text-center">
                {t.pastEvents.tba}
              </p>
            </ToBeAnnounced>
          </div>
        {/if}
      </div>
    </section>
  </div>
</main>

<style lang="postcss">
  .action-card {
    display: flex;
    flex: 1;
    flex-direction: column;

    padding: 24px;

    border: 1px solid currentcolor;
    border-radius: 20px;

    @screen tb {
      padding: 32px;
    }
  }
</style>
