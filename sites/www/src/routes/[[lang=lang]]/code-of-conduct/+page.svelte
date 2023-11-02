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
    <section class="border border-current rounded-[20px] p-6 tb:p-8" use:intersect>
      <h2 class="sr-only">{t.notice.title}</h2>
      <div class="space-y-4">
        <p>{@html t.notice.description}</p>
        <p>{@html t.notice.action}</p>
        <div class="flex items-center gap-4 upto-tb:flex-col">
          <a href={SOCIAL_LINKS.DISCORD} class="c-btn w-fit">
            {t.notice.ctas.discord}
          </a>
          <p>
            Email: <a class="c-link" href="mailto:{EMAILS.COC}">{EMAILS.COC}</a>
          </p>
        </div>
      </div>
    </section>

    <section class="space-y-6">
      <ConsecutiveFadeUpIntro selector=".char">
        <h2 class="tp-h2 font-medium uppercase">
          <SplitText text={t.excerpt.title} />
        </h2>
      </ConsecutiveFadeUpIntro>
      <p use:intersect>{@html t.excerpt.intro}</p>
      <figure class="excerpt" use:intersect>
        <blockquote>
          <p>{@html t.excerpt.quote}</p>
        </blockquote>
        <figcaption>{@html t.excerpt.caption}</figcaption>
      </figure>
    </section>
  </div>
</main>

<style lang="postcss">
  .excerpt {
    display: grid;
    grid-template-areas:
      'line quote'
      'line caption';
    grid-template-columns: auto 1fr;
    row-gap: 24px;
    column-gap: 16px;

    &::before {
      content: '';

      display: grid;
      grid-area: line;

      width: 4px;
      height: 100%;

      background-color: currentcolor;
    }

    & blockquote {
      grid-area: quote;
    }

    & figcaption {
      grid-area: caption;
      padding-bottom: 8px;
    }
  }
</style>
