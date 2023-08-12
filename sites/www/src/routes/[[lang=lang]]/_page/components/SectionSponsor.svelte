<script lang="ts">
  import { intersect } from '$client/actions/intersect';
  import { splitFade } from '$client/actions/splitFade';
  import { AnimatedArrowCircle } from '$client/components/AnimatedArrowCircle';
  import SvelteVietnamLogo from '$client/components/SvelteVietnamLogo/SvelteVietnamLogo.svelte';
  import type { Language } from '$shared/services/i18n';
  import { SPONSOR_PATH } from '$shared/services/navigation';
  import type { Sponsor } from '$shared/types';

  import { translations } from '../translation';

  export let lang: Language;
  export let sponsors: Sponsor[];

  $: t = translations[lang].sponsor;
</script>

<section class="sponsors c-container-design">
  <a href={SPONSOR_PATH} title={t.title} class="section-title-container" use:splitFade>
    <h2 class="section-title">
      {t.title}
    </h2>
    <AnimatedArrowCircle class="h-12 w-12 tb:h-16 tb:w-16" handle="parent" />
  </a>
  <p class="section-desc mt-6 pc:mt-8" use:intersect>{t.description}</p>
  <!-- FIXME: refactor to plain css here -->
  <ul class="mt-10 flex flex-wrap gap-x-[73px] gap-y-[62px] pc:mt-20" use:intersect>
    {#each sponsors as _}
      <li class="flex items-center space-x-2 pc:space-x-4">
        <SvelteVietnamLogo width={50} height={56} version="themed" class="sp:w-[32px]" />
        <p class="w-[50px] text-[11px] uppercase pc:w-[90px] pc:text-[20px]">Svelte Vietnam</p>
      </li>
    {/each}
  </ul>
</section>

<style lang="postcss">
  .sponsors {
    margin-top: 80px;
    padding-bottom: 120px;

    @screen tb {
      padding-top: 80px;
      padding-bottom: 108px;
    }
  }
</style>
