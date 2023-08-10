<script lang="ts">
  import { EMAILS, SOCIAL_LINKS } from '$shared/constants';
  import type { Language } from '$shared/services/i18n';
  import {
    CODE_OF_CONDUCT_PATH,
    HOME_PATH,
    RSS_PATH,
    SITEMAP_PATH,
    TOP_LEVEL_PATHS,
    getPathLabel,
    isCurrentPage,
  } from '$shared/services/navigation';

  import { translations } from './translation';

  export let pathname: string;
  export let version: string;
  export let lang: Language;

  $: t = translations[lang];
</script>

<footer>
  <div class="footer-top c-container-design">
    <div class="footer-sections">
      <section class="footer-about-us">
        <p class="footer-section-title">{t.aboutUs.title}</p>
        <p>{t.aboutUs.description}</p>
      </section>
      <section class="footer-navigation">
        <p class="footer-section-title">{t.navigation.title}</p>
        <nav aria-label="all internal pages" data-sveltekit-preload-data="hover">
          <ul>
            {#each [HOME_PATH, ...TOP_LEVEL_PATHS] as href}
              {@const current = isCurrentPage(pathname, href)}
              <li>
                <a aria-current={current} {href} class="footer-link">{getPathLabel(href, lang)}</a>
              </li>
            {/each}
          </ul>
        </nav>
      </section>
      <section class="footer-contact">
        <p class="footer-section-title">{t.contact.title}</p>
        <ul>
          <li>
            <a href={SOCIAL_LINKS.discord} target="_blank" class="footer-link" rel="noreferrer">
              <svg inline-src="simpleicon/discord" width="24" height="24" />
              <span>Svelte Vietnam</span>
            </a>
          </li>
          <li>
            <a href="mailto:{EMAILS.contact}" target="_blank" class="footer-link" rel="noreferrer">
              <svg inline-src="google/mail" width="24" height="24" />
              <span>{EMAILS.contact}</span>
            </a>
          </li>
        </ul>
      </section>
    </div>
    <div class="footer-logo">
      <svg inline-src="sveltevietnam-grayscale" width="76" height="86" />
      <p>Svelte <br aria-disabled /> Vietnam</p>
    </div>
  </div>
  <ul class="footer-socials c-container-design">
    <li>
      <a href={SOCIAL_LINKS.openCollective} target="_blank" rel="noreferrer" class="footer-link">
        <svg height="16" width="16" inline-src="simpleicon/opencollective" />
      </a>
    </li>
    <li>
      <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" class="footer-link">
        <svg height="16" width="16" inline-src="simpleicon/github" />
      </a>
    </li>
    <li>
      <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noreferrer" class="footer-link">
        <svg height="16" width="16" inline-src="simpleicon/twitter" />
      </a>
    </li>
    <li>
      <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noreferrer" class="footer-link">
        <svg height="16" width="16" inline-src="simpleicon/facebook" />
      </a>
    </li>
  </ul>
  <div class="footer-bottom c-container-design">
    <p class="footer-version">
      {t.version}
      {version}
    </p>
    <p class="footer-info">
      <span>
        {new Date().getFullYear()} © Svelte Vietnam
      </span>
      <span aria-disabled class="vertical-separator">|</span>
      <span>
        {t.poweredBy}
        <a href="https://kit.svelte.dev/" target="_blank" rel="noreferrer">
          <svg class="inline-block" height="14" width="14" inline-src="svelte" />
        </a>
        <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer">
          <svg class="inline-block" height="14" width="14" inline-src="simpleicon/tailwindcss" />
        </a>
        <a href="https://www.cloudflare.com/" target="_blank" rel="noreferrer">
          <svg
            class="inline-block"
            height="14"
            width="14"
            inline-src="simpleicon/cloudflarepages"
          />
        </a>
      </span>
    </p>
    <p class="footer-additional-links">
      <a
        href={CODE_OF_CONDUCT_PATH}
        class="footer-link"
        aria-current={isCurrentPage(pathname, CODE_OF_CONDUCT_PATH)}>{t.navigation.codeOfConduct}</a
      >
      <span aria-disabled class="vertical-separator">|</span>
      <a href={RSS_PATH} class="footer-link" target="_blank">RSS</a>
      <span aria-disabled class="vertical-separator">|</span>
      <a href={SITEMAP_PATH} class="footer-link" target="_blank">Sitemap</a>
    </p>
  </div>
</footer>

<style lang="postcss">
  footer {
    position: relative;
    background-color: theme('colors.design.bg.2');
    border-top: 1px solid theme('colors.design.border.1');

    &::before {
      content: '';

      position: absolute;
      z-index: -1;
      right: 0;
      bottom: calc(100% + 1px);
      left: 0;

      height: 150px;

      background: linear-gradient(
        to bottom,
        theme('colors.design.bg.1'),
        theme('colors.design.bg.2') 100%
      );

      @screen pc {
        height: 200px;
      }
    }
  }

  .footer-top {
    width: 100%;
    margin: 40px 0 48px;

    @screen pc {
      display: flex;
      gap: 64px;
      align-items: flex-start;
      justify-content: space-between;

      margin: 60px auto;
    }
  }

  .footer-sections {
    display: flex;
    flex-direction: column;
    gap: 32px;

    @screen pc {
      flex-direction: row;
    }

    @screen xl {
      gap: 64px;
    }
  }

  .footer-section-title {
    margin-bottom: 24px;
    font-family: theme('fontFamily.lora');
    font-size: 20px;
    font-weight: 500;

    @screen pc {
      margin-bottom: 32px;
    }
  }

  .footer-about-us {
    @screen pc {
      width: 262px;
    }
  }

  .footer-navigation {
    & ul {
      display: grid;
      grid-template-columns: repeat(3, min-content);
      row-gap: 16px;
      column-gap: 32px;

      white-space: nowrap;

      @screen pc {
        grid-template-columns: 1fr;
        column-gap: 12px;
      }
    }
  }

  .footer-contact {
    & ul {
      display: flex;
      flex-direction: column;
      gap: 16px;

      @screen pc {
        gap: 12px;
      }
    }

    & a {
      display: flex;
      gap: 8px;
      align-items: center;
    }
  }

  .footer-logo {
    display: none;
    gap: 24px;

    font-size: 30px;
    line-height: normal;
    text-transform: uppercase;

    @screen pc {
      display: flex;
    }
  }

  .footer-socials {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 24px;

    @screen pc {
      justify-content: flex-end;
    }

    & a {
      display: block;
      padding: 7px;
      border: 1px solid currentcolor;
      border-radius: theme('borderRadius.full');
    }
  }

  .footer-bottom {
    position: relative;

    display: flex;
    flex-direction: column-reverse;
    gap: 16px;
    align-items: flex-start;

    padding-top: 20px;
    padding-bottom: 20px;

    font-size: 12px;

    border-top: 1px solid theme('colors.design.border.1');

    @screen pc {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      padding-top: 14px;
      padding-bottom: 14px;
    }
  }

  .footer-version {
    color: theme('colors.design.neutral.2');
  }

  .footer-info {
    display: flex;
    gap: 8px;
    align-items: center;

    @screen pc {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    & svg {
      filter: grayscale(1);
    }

    & a:hover svg {
      filter: none;
    }
  }

  .footer-additional-links {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .footer-link {
    transition: color 400ms ease-out;

    &:hover,
    &[aria-current='true'] {
      color: theme('colors.design.link.title');
    }

    & svg {
      fill: currentcolor;
    }
  }
</style>
