<script lang="ts">
  import { intersect } from '$client/actions/intersect';
  import { AnimatedArrowCircle } from '$client/components/AnimatedArrowCircle';
  import { ConsecutiveFadeUpIntro } from '$client/components/ConsecutiveFadeUpIntro';
  import { SplitText } from '$client/components/SplitText';
  import { SvelteVietnamLogo } from '$client/components/SvelteVietnamLogo';
  import type { Language } from '$shared/services/i18n';
  import { SPONSOR_PATH } from '$shared/services/navigation';
  import type { Sponsor } from '$shared/types';

  import { translations } from '../translation';

  export let lang: Language;
  export let sponsors: Sponsor[];

  $: t = translations[lang].sponsor;
</script>

<section class="sponsors c-container-design">
  <ConsecutiveFadeUpIntro selector=":is(.arrow, .char)">
    <a href={SPONSOR_PATH} title={t.title} class="section-title-container">
      <h2 class="tp-h2 uppercase">
        <SplitText text={t.title} />
      </h2>
      <AnimatedArrowCircle class="arrow h-12 w-12 tb:h-16 tb:w-16" handle="parent" />
    </a>
  </ConsecutiveFadeUpIntro>
  <p class="section-desc mt-6" use:intersect>{t.description}</p>
  <!-- FIXME: refactor to plain css here -->
  <ul use:intersect>
    {#each sponsors as _}
      <li class="flex items-center space-x-2 pc:space-x-4">
        <SvelteVietnamLogo width={50} height={56} version="themed" class="sp:w-[32px] sp:h-auto" />
        <p class="text-[11px] uppercase pc:text-[20px] leading-normal">Svelte<br />Vietnam</p>
      </li>
    {/each}
  </ul>
</section>

<style lang="postcss">
  .sponsors {
    margin-top: 80px;
    padding-bottom: 120px;

    @screen tb {
      margin-top: 120px;
      padding-bottom: 108px;
    }
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    margin-top: 24px;

    @screen tb {
      gap: 40px;
      margin-top: 60px;
    }
  }
</style>
