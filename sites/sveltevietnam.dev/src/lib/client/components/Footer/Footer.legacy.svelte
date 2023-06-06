<script lang="ts">
  import { page } from '$app/stores';
  import { SOCIAL_LINKS } from '$shared/constants';
  import type { Language } from '$shared/services/i18n';
  import { getCodeOfConductHref } from '$shared/services/navigation';

  import { translations } from './translation';

  export let lang: Language;

  $: t = translations[lang];
</script>

<footer class="max-md:text-sm bg-bg-200 py-6">
  <div class="c-container">
    <section class="info">
      <span>{new Date().getFullYear()} © <strong>Svelte Vietnam</strong></span>
      <span aria-disabled class="mx-1 md:mx-2">|</span>
      <span>
        {t.poweredBy}
        <a
          href="https://kit.svelte.dev/"
          target="_blank"
          rel="noreferrer"
          class="c-link c-link--icon"
        >
          <svg class="inline-block" height="16" width="16" inline-src="svelte" />
        </a>
        <a
          href="https://tailwindcss.com/"
          target="_blank"
          rel="noreferrer"
          class="c-link c-link--icon"
        >
          <svg class="inline-block" height="16" width="16" inline-src="simpleicon/tailwindcss" />
        </a>
        <a
          href="https://www.cloudflare.com/"
          target="_blank"
          rel="noreferrer"
          class="c-link c-link--icon"
        >
          <svg
            class="inline-block"
            height="16"
            width="16"
            inline-src="simpleicon/cloudflarepages"
          />
        </a>
      </span>
    </section>
    <section class="socials space-x-2 md:space-x-4">
      <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" class="c-link c-link--icon">
        <svg class="inline-block" height="20" width="20" inline-src="simpleicon/github" />
      </a>
      <a href={SOCIAL_LINKS.discord} target="_blank" rel="noreferrer" class="c-link c-link--icon">
        <svg class="inline-block" height="20" width="20" inline-src="simpleicon/discord" />
      </a>
      <a
        href={SOCIAL_LINKS.openCollective}
        target="_blank"
        rel="noreferrer"
        class="c-link c-link--icon"
      >
        <svg class="inline-block" height="20" width="20" inline-src="simpleicon/opencollective" />
      </a>
      <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noreferrer" class="c-link c-link--icon">
        <svg class="inline-block" height="20" width="20" inline-src="simpleicon/twitter" />
      </a>
      <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noreferrer" class="c-link c-link--icon">
        <svg class="inline-block" height="20" width="20" inline-src="simpleicon/facebook" />
      </a>
    </section>
    <section class="links flex space-x-2 md:space-x-4">
      <a href="/sitemap.xml" class="c-link c-link--icon flex space-x-1" target="_blank">
        <svg
          height="20"
          width="20"
          class="max-md:h-4 max-md:w-4"
          inline-src="google/account-tree"
        />
        <span class="md:hidden">Sitemap</span>
      </a>
      <a href="/rss.xml" class="c-link c-link--icon flex space-x-1" target="_blank">
        <svg height="20" width="20" class="max-md:h-4 max-md:w-4" inline-src="google/rss-feed" />
        <span class="md:hidden">RSS</span>
      </a>
      <a href={getCodeOfConductHref(lang)} class="c-link c-link--icon flex space-x-1">
        <svg height="20" width="20" class="max-md:h-4 max-md:w-4" inline-src="google/diversity-1" />
        <span
          class="md:hidden"
          class:font-bold={$page.url.pathname === getCodeOfConductHref(lang)}
        />
      </a>
    </section>
  </div>
</footer>

<style lang="postcss">
  footer > div {
    display: grid;
    grid-template-areas:
      'socials'
      'links'
      'info';
    row-gap: theme('spacing.5');
    align-items: center;
    justify-content: center;
    justify-items: center;

    @screen md {
      grid-template-areas: 'links info socials';
      grid-template-columns: 1fr auto 1fr;
      row-gap: 0;
    }
  }

  .socials {
    grid-area: socials;

    @screen md {
      justify-self: end;
    }
  }

  .links {
    grid-area: links;

    @screen md {
      justify-self: start;
    }
  }

  .info {
    grid-area: info;
  }
</style>
