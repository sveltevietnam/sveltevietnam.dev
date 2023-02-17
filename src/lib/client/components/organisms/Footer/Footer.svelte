<script lang="ts">
  import { page } from '$app/stores';
  import AccountTree from '$client/components/icons/google/AccountTree.svelte';
  import Diversity from '$client/components/icons/google/Diversity.svelte';
  import Rss from '$client/components/icons/google/Rss.svelte';
  import Discord from '$client/components/icons/simpleicons/Discord.svelte';
  import Facebook from '$client/components/icons/simpleicons/Facebook.svelte';
  import Github from '$client/components/icons/simpleicons/Github.svelte';
  import Svelte from '$client/components/icons/simpleicons/Svelte.svelte';
  import Tailwind from '$client/components/icons/simpleicons/Tailwind.svelte';
  import Twitter from '$client/components/icons/simpleicons/Twitter.svelte';
  import Vercel from '$client/components/icons/simpleicons/Vercel.svelte';
  import { APP_ROUTE_TREE, SOCIAL_LINKS } from '$shared/constants';
  import type { Language } from '$shared/services/i18n';
  import { translations } from '$shared/services/i18n/translations/footer';

  export let lang: Language;

  $: t = translations[lang];

  $: codeOfConductLink = APP_ROUTE_TREE[':lang']['code-of-conduct'].$.path({
    args: { ':lang': lang },
  });
</script>

<footer class="bg-bg-200 py-6 text-sm">
  <div class="c-container">
    <section class="info">
      <span>{new Date().getFullYear()} © <strong>Svelte Vietnam</strong></span>
      <span aria-disabled class="mx-1 md:mx-2">|</span>
      <span>
        {t.poweredBy}
        <a href="https://kit.svelte.dev/" target="_blank" rel="noreferrer" class="c-link">
          <Svelte class="inline-block" height="16" width="16" />
        </a>
        <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer" class="c-link">
          <Tailwind class="inline-block" height="16" width="16" />
        </a>
        <a href="https://vercel.com/" target="_blank" rel="noreferrer" class="c-link">
          <Vercel class="inline-block" height="16" width="16" />
        </a>
      </span>
    </section>
    <section class="socials space-x-2 md:space-x-4">
      <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" class="c-link">
        <Github class="inline-block h-5 w-5" />
      </a>
      <a href={SOCIAL_LINKS.discord} target="_blank" rel="noreferrer" class="c-link">
        <Discord class="inline-block h-5 w-5" />
      </a>
      <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noreferrer" class="c-link">
        <Twitter class="inline-block h-5 w-5" />
      </a>
      <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noreferrer" class="c-link">
        <Facebook class="inline-block h-5 w-5" />
      </a>
    </section>
    <section class="links flex space-x-2 md:space-x-4">
      <a href="/sitemap.xml" class="c-link flex space-x-1" target="_blank">
        <AccountTree title="Sitemap" height="16" width="16" />
        <span>Sitemap</span>
      </a>
      <a href="/rss.xml" class="c-link flex space-x-1" target="_blank">
        <Rss height="16" width="16" />
        <span>RSS</span>
      </a>
      <!-- svelte-ignore security-anchor-rel-noreferrer -->
      <a href={codeOfConductLink} class="c-link flex space-x-1">
        <Diversity height="16" width="16" />
        <span class:font-bold={$page.url.pathname === codeOfConductLink}>{t.codeOfConduct}</span>
      </a>
    </section>
  </div>
</footer>

<style lang="postcss">
  footer > div {
    display: grid;
    align-items: center;
    justify-content: center;
    justify-items: center;
    grid-template-areas:
      'socials'
      'links'
      'info';
    row-gap: theme('spacing.5');

    @screen md {
      grid-template-areas: 'links info socials';
      grid-template-columns: 1fr auto 1fr;
      row-gap: 0;
    }
  }

  .socials {
    grid-area: socials;
  }

  .links {
    grid-area: links;
  }

  .info {
    grid-area: info;
  }
</style>
