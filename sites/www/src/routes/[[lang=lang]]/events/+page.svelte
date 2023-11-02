<script lang="ts">
  import { intersect } from '$client/actions/intersect';
  import { Breadcrumbs } from '$client/components/Breadcrumbs';
  import { ConsecutiveFadeUpIntro } from '$client/components/ConsecutiveFadeUpIntro';
  import { EventCard } from '$client/components/EventCard';
  import { MailRegistrationForm } from '$client/components/MailRegistrationForm';
  import { SplitText } from '$client/components/SplitText';
  import { ToBeAnnounced } from '$client/components/ToBeAnnounced';
  import { EMAILS, SOCIAL_LINKS } from '$shared/constants';
  import { translations as commonT } from '$shared/services/i18n/translations/common';
  import { SPONSOR_PATH } from '$shared/services/navigation';

  import type { PageData } from './$types';
  import keyVisuals from './_page/images/key-visuals.webp';

  export let data: PageData;

  $: t = data.translations.page;
  $: tMail = data.translations.mail;
</script>

<main class="c-container-design">
  <div class="mt-6" use:intersect>
    <Breadcrumbs breadcrumbs={data.breadcrumbs} />
  </div>
  <section class="tb:flex tb:justify-between tb:flex-row mb-[60px] tb:mb-16" use:intersect>
    <div class="tb:max-w-[500px] tb:mt-[100px] mt-8">
      <h1 class="tp-h1 uppercase">{t.title}</h1>
      <p class="tp-h4 mt-6 tb:mt-8">{t.subtitle}</p>
    </div>
    <div class="sp:mt-8">
      <img
        src={keyVisuals}
        alt="people meet together through events"
        width="548"
        height="547"
        class="w-full h-auto max-w-[548px]"
      />
    </div>
  </section>
  <div class="space-y-[60px] tb:space-y-[120px] pb-[120px] tb:pb-[200px]">
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
              <p class="text-center tp-h4 font-medium">
                {t.upcomingEvents.tba.description}
              </p>
              <p class="mt-4">
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
          <div class="flex items-center justify-between">
            <h3 class="tp-h3 font-medium">{t.actions.share.title}</h3>
            <svg
              width="56"
              height="41"
              viewBox="0 0 56 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="opacity-40"
            >
              <rect x="43.3333" y="15" width="12" height="12" fill="currentcolor" />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M40 0.5H0V40.5H40V27H28V15H40V0.5Z"
                fill="currentcolor"
              />
            </svg>
          </div>
          <div class="flex-1 mt-6 space-y-1">
            <p>{t.actions.share.description}</p>
            <p>{t.actions.share.call}</p>
          </div>
          <p>
            Email
            <a href="mailto:{EMAILS.EVENTS}" class="c-link">
              {EMAILS.EVENTS}
            </a>
          </p>
        </section>
        <section class="action-card" use:intersect id="mail">
          <div class="flex items-center justify-between">
            <h3 class="tp-h3 font-medium">{t.actions.participate.title}</h3>
            <svg
              width="53"
              height="41"
              viewBox="0 0 53 41"
              xmlns="http://www.w3.org/2000/svg"
              class="opacity-40"
            >
              <circle cx="32.6665" cy="20.5" r="20" fill="currentcolor" />
              <circle cx="6.6665" cy="34.5" r="6" fill="currentcolor" />
            </svg>
          </div>
          <p class="flex-1 mt-6">{t.actions.participate.description}</p>
          <MailRegistrationForm
            t={tMail}
            language={data.language}
            superValidated={data.mailForm}
            class="mt-6"
          />
        </section>
        <section class="action-card" use:intersect>
          <div class="flex items-center justify-between">
            <h3 class="tp-h3 font-medium">{t.actions.sponsor.title}</h3>
            <svg
              width="47"
              height="41"
              viewBox="0 0 47 41"
              xmlns="http://www.w3.org/2000/svg"
              class="opacity-40"
            >
              <rect
                x="0.0666504"
                y="27.1667"
                width="14.7242"
                height="13.3333"
                fill="currentcolor"
              />
              <rect x="6.96863" y="13.8333" width="14.7242" height="13.3333" fill="currentcolor" />
              <rect x="13.8705" y="0.5" width="14.7242" height="13.3333" fill="currentcolor" />
              <rect x="25.3738" y="27.1667" width="14.7242" height="13.3333" fill="currentcolor" />
              <rect x="32.2758" y="13.8333" width="14.7242" height="13.3333" fill="currentcolor" />
            </svg>
          </div>
          <p class="flex-1 mt-6">{t.actions.sponsor.description}</p>
          <a class="c-link text-xs w-fit" href="{SPONSOR_PATH}#why">
            {t.actions.sponsor.whyNeedSponsor}
          </a>
          <a href={SPONSOR_PATH} class="c-btn mt-4">{t.actions.sponsor.cta}</a>
        </section>
        <p
          class="text-center self-center pc:col-span-3 sp:w-8/12 justify-self-center"
          use:intersect
        >
          {t.actions.discord}
          <a href={SOCIAL_LINKS.DISCORD} class="c-link" external>
            {commonT[data.language].sveltevienam} Discord
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
