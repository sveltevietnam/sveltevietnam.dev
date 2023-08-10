<script lang="ts">
  import { JobCard } from '$client/components/JobCard';
  import { MailRegistrationForm } from '$client/components/MailRegistrationForm';
  import { SPONSOR_PATH } from '$shared/services/navigation';

  import type { ActionData } from './$types';

  export let data;
  export let form: ActionData;

  $: t = data.translations.page;
  $: tMail = data.translations.mail;
  const { fromRecruitmentSites, fromSponsors } = data.jobs;
  const collectedAt = fromRecruitmentSites.collectedAt;
  const collectedTimestamp = `${collectedAt.toLocaleTimeString()} - ${collectedAt.toLocaleDateString()}`;
</script>

<main class="c-page">
  <section class="c-page@header">
    <h1 class="c-page@h1">{t.title}</h1>
    <p class="c-page@h1-sub">{t.subtitle}</p>
  </section>

  <section class="space-y-10">
    <div class="flex items-center justify-between">
      <h2 class="c-page@h2">{t.fromSponsors.title}</h2>
      <a href={SPONSOR_PATH} class="max-md:hidden c-btn">{t.fromSponsors.cta}</a>
    </div>
    <ul class="grid grid-cols-1 gap-10 md:grid-cols-2">
      {#each fromSponsors as job}
        <li>
          <JobCard {job} lang={data.language} />
        </li>
      {/each}
    </ul>
  </section>

  <div class="grid grid-cols-1 gap-10 md:grid-cols-2">
    <section class="c-action-card">
      <div class="c-graphic" />
      <h2 class="c-page@h2 text-center">{t.actions.recruiter.title}</h2>
      <p>{t.actions.recruiter.description}</p>
      <a href={SPONSOR_PATH} class="c-btn">
        {t.actions.recruiter.cta}
      </a>
      <a class="c-link text-xs italic" href="{SPONSOR_PATH}#why">
        {t.actions.recruiter.whyNeedSponsor}
      </a>
    </section>

    <section class="c-action-card">
      <div class="c-graphic" />
      <h2 class="c-page@h2">{t.actions.candidate.title}</h2>
      <p>{t.actions.candidate.description}</p>
      <MailRegistrationForm
        t={tMail}
        language={data.language}
        colorScheme={data.colorScheme}
        name={form?.data?.name}
        nameError={form?.error?.form?.name?.[0]}
        email={form?.data?.email}
        emailError={form?.error?.form?.email?.[0]}
        turnstileError={form?.error?.turnstile?.[0]}
      />
    </section>
  </div>

  <section class="space-y-10">
    <div class="space-x-1">
      <h2 class="c-page@h2 inline">{t.fromRecruitmentSites.title}</h2>
      <p class="inline">({t.fromRecruitmentSites.collectedAt} {collectedTimestamp})</p>
    </div>
    <ul class="grid grid-cols-1 gap-10 md:grid-cols-2">
      {#each fromRecruitmentSites.jobs as job}
        <li>
          <JobCard {job} lang={data.language} />
        </li>
      {/each}
    </ul>
  </section>
</main>
