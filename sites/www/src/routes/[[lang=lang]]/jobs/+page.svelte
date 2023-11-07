<script lang="ts">
  import { intersect } from '$client/actions/intersect';
  import { Breadcrumbs } from '$client/components/Breadcrumbs';
  import { ConsecutiveFadeUpIntro } from '$client/components/ConsecutiveFadeUpIntro';
  import { JobCard } from '$client/components/JobCard';
  import { MailRegistrationForm } from '$client/components/MailRegistrationForm';
  import { SplitText } from '$client/components/SplitText';
  import { ToBeAnnounced } from '$client/components/ToBeAnnounced';
  import { SPONSOR_PATH } from '$shared/services/navigation';

  import keyVisuals from './_page/images/key-visuals.webp';

  export let data;

  $: t = data.translations.page;
  $: tMail = data.translations.mail;
  $: ({ fromRecruitmentSites, fromSponsors } = data.jobs);
  $: collectedTimestamp = `${fromRecruitmentSites.collectedAt.toLocaleTimeString()} - ${fromRecruitmentSites.collectedAt.toLocaleDateString()}`;
</script>

<main class="c-container-design">
  <div class="mt-6" use:intersect>
    <Breadcrumbs breadcrumbs={data.breadcrumbs} />
  </div>
  <section class="tb:flex tb:justify-between tb:flex-row mb-[60px] tb:mb-16" use:intersect>
    <div class="tb:max-w-[500px] tb:mt-[100px] mt-8">
      <h1 class="tp-h1 uppercase">{t.title}</h1>
      <p class="tp-h5 leading-normal mt-6 tb:mt-8">{t.subtitle}</p>
    </div>
    <div class="sp:mt-8">
      <img
        src={keyVisuals}
        alt="hands passing suitcases through a circular band"
        width="496"
        height="500"
        class="w-full h-auto max-w-[548px]"
      />
    </div>
  </section>
  <div class="space-y-[60px] tb:space-y-[120px] pb-[120px] tb:pb-[200px]">
    <section>
      <ConsecutiveFadeUpIntro selector=".char">
        <h2 class="tp-h2 uppercase">
          <SplitText text={t.fromSponsors.title} />
        </h2>
      </ConsecutiveFadeUpIntro>

      <div class="mt-10 tb:mt-[60px]">
        {#if fromSponsors.length}
          <ul class="grid grid-cols-1 gap-10 md:grid-cols-2">
            {#each fromSponsors as job}
              <li>
                <JobCard {job} />
              </li>
            {/each}
          </ul>
        {:else}
          <div use:intersect class="text-center">
            <ToBeAnnounced>
              <p class="tp-h4 font-medium">
                {t.fromSponsors.tba.description}
              </p>
              <p class="mt-4">
                <a href="#sponsor" class="c-link">{t.fromSponsors.tba.cta}</a>
              </p>
            </ToBeAnnounced>
          </div>
        {/if}
      </div>
    </section>

    <section>
      <h2 class="sr-only">{t.actions.title}</h2>
      <div class="grid grid-cols-1 tb:grid-cols-2 gap-8">
        <section class="c-action-card" use:intersect id="sponsor">
          <h3 class="tp-h3 font-medium">{t.actions.recruiter.title}</h3>
          <div class="flex-1 mt-6">
            <p>{t.actions.recruiter.description}</p>
            <ul class="mt-4 space-y-1">
              <li>1. {@html t.actions.recruiter.steps.sponsor}</li>
              <li>2. {@html t.actions.recruiter.steps.contact}</li>
            </ul>
          </div>
          <a class="c-link text-xs w-fit mt-4" href="{SPONSOR_PATH}#why">
            {t.actions.recruiter.whyNeedSponsor}
          </a>
          <a href={SPONSOR_PATH} class="c-btn mt-4">{t.actions.recruiter.cta}</a>
        </section>
        <section class="c-action-card" use:intersect id="mail">
          <h3 class="tp-h3 font-medium">{t.actions.candidate.title}</h3>
          <p class="flex-1 mt-6">{t.actions.candidate.description}</p>
          <MailRegistrationForm t={tMail} superValidated={data.mailForm} class="mt-6" />
        </section>
      </div>
    </section>

    <section>
      <ConsecutiveFadeUpIntro selector=".char">
        <h2 class="tp-h2 uppercase">
          <SplitText text={t.fromRecruitmentSites.title} />
        </h2>
      </ConsecutiveFadeUpIntro>
      <p class="mt-6" use:intersect>
        <!-- {t.fromRecruitmentSites.collectedAt} {collectedTimestamp}. -->
        {@html t.fromRecruitmentSites.notice}
      </p>

      <div class="mt-10 tb:mt-[60px]">
        {#if fromRecruitmentSites.jobs.length}
          <ul class="grid grid-cols-1 gap-10 md:grid-cols-2">
            {#each fromRecruitmentSites.jobs as job}
              <li>
                <JobCard {job} />
              </li>
            {/each}
          </ul>
        {:else}
          <div use:intersect class="text-center">
            <ToBeAnnounced>
              <p class="tp-h4 font-medium">
                {t.fromRecruitmentSites.tba.description}
              </p>
              <p class="mt-4">
                <a href="#mail" class="c-link">{t.fromRecruitmentSites.tba.cta}</a>
              </p>
            </ToBeAnnounced>
          </div>
        {/if}
      </div>
    </section>
  </div>
</main>
