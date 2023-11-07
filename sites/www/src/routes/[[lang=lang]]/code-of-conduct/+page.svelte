<script lang="ts">
  import { intersect } from '$client/actions/intersect';
  import { Breadcrumbs } from '$client/components/Breadcrumbs';
  import { ConsecutiveFadeUpIntro } from '$client/components/ConsecutiveFadeUpIntro';
  import { SplitText } from '$client/components/SplitText';
  import { EMAILS, SOCIAL_LINKS } from '$shared/constants';

  import type { PageData } from './$types';

  export let data: PageData;

  $: t = data.translations.page;
</script>

<main class="c-container-design">
  <div class="mt-6" use:intersect>
    <Breadcrumbs breadcrumbs={data.breadcrumbs} />
  </div>

  <section class="mt-8 tb:mt-[60px]">
    <h1 class="tp-h1 uppercase font-medium" use:intersect>{t.title}</h1>
  </section>

  <div class="space-y-[60px] tb:space-y-[120px] py-[60px] tb:pb-[200px] tb:pt-[120px]">
    <section use:intersect>
      <h2 class="sr-only">{t.notice.title}</h2>
      <div class="space-y-4">
        <p>{@html t.notice.description}</p>
        <p>{@html t.notice.action}</p>
        <ul class="divider-border divide-y font-medium mt-4 max-w-[548px]" use:intersect>
          <li>
            <a href={SOCIAL_LINKS.DISCORD} class="c-link-box" external>
              <span>{t.notice.ctas.discord}</span>
              <svg inline-src="icon/external-link" />
            </a>
          </li>
          <li>
            <a class="c-link-box" href="mailto:{EMAILS.COC}" external>
              <span>Email {EMAILS.COC}</span>
              <svg inline-src="icon/external-link" />
            </a>
          </li>
        </ul>
      </div>
    </section>

    <section>
      <ConsecutiveFadeUpIntro selector=".char">
        <h2 class="tp-h2 font-medium uppercase">
          <SplitText text={t.excerpt.title} />
        </h2>
      </ConsecutiveFadeUpIntro>
      <p class="mt-6" use:intersect>{@html t.excerpt.intro}</p>
      <div class="relative tb:pr-[48px] tb:pl-[140px] mt-10 tb:mt-[60px]" use:intersect>
        <blockquote cite="https://sveltesociety.dev/about">
          <div aria-disabled class="tb:absolute top-[-18px] left-[95px] flex gap-0.5 upto-tb:mb-3">
            <svg inline-src="icon/quote-open" width="16" height="30" />
            <svg
              class="text-design-neutral-2"
              inline-src="icon/quote-open"
              width="16"
              height="30"
            />
          </div>
          <p>{@html t.excerpt.quote}</p>
          <div
            aria-disabled
            class="tb:absolute bottom-6 right-0 flex gap-0.5 upto-tb:mt-3 upto-tb:ml-auto w-fit"
          >
            <svg
              class="text-design-neutral-2"
              inline-src="icon/quote-close"
              width="16"
              height="30"
            />
            <svg inline-src="icon/quote-close" width="16" height="30" />
          </div>
          <footer class="mt-5 text-design-neutral-2">
            <cite class="not-italic">{@html t.excerpt.caption}</cite>
          </footer>
        </blockquote>
      </div>
    </section>
  </div>
</main>
