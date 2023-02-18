<script lang="ts">
  import { page } from '$app/stores';
  import AccountTree from '$client/components/icons/google/AccountTree.svelte';
  import Diversity from '$client/components/icons/google/Diversity.svelte';
  import Rss from '$client/components/icons/google/Rss.svelte';
  import Discord from '$client/components/icons/simpleicons/Discord.svelte';
  import Facebook from '$client/components/icons/simpleicons/Facebook.svelte';
  import Github from '$client/components/icons/simpleicons/Github.svelte';
  import OpenCollective from '$client/components/icons/simpleicons/OpenCollective.svelte';
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

<footer class="bg-bg-200 py-6 max-md:text-sm">
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
        <Github class="inline-block" height="20" width="20" />
      </a>
      <a href={SOCIAL_LINKS.discord} target="_blank" rel="noreferrer" class="c-link">
        <Discord class="inline-block" height="20" width="20" />
      </a>
      <a href={SOCIAL_LINKS.openCollective} target="_blank" rel="noreferrer" class="c-link">
        <OpenCollective class="inline-block" height="20" width="20" />
      </a>
      <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noreferrer" class="c-link">
        <Twitter class="inline-block" height="20" width="20" />
      </a>
      <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noreferrer" class="c-link">
        <Facebook class="inline-block" height="20" width="20" />
      </a>
    </section>
    <section class="links flex space-x-2 md:space-x-4">
      <a href="/sitemap.xml" class="c-link flex space-x-1" target="_blank">
        <AccountTree title="Sitemap" height="20" width="20" class="max-md:h-4 max-md:w-4" />
        <!-- FIXME: add a tooltip here on md -->
        <span class="md:hidden">Sitemap</span>
      </a>
      <a href="/rss.xml" class="c-link flex space-x-1" target="_blank">
        <Rss height="20" width="20" class="max-md:h-4 max-md:w-4" />
        <span class="md:hidden">RSS</span>
      </a>
      <!-- svelte-ignore security-anchor-rel-noreferrer -->
      <a href={codeOfConductLink} class="c-link flex space-x-1">
        <Diversity height="20" width="20" class="max-md:h-4 max-md:w-4" />
        <span class="md:hidden" class:font-bold={$page.url.pathname === codeOfConductLink}
          >{t.codeOfConduct}</span
        >
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
