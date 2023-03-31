<script lang="ts">
  import { enhance } from '$app/forms';
  import { turnstile } from '$client/actions/turnstile';
  import { PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY } from '$env/static/public';
  import { CLOUDFLARE_TURNSTILE_FORM_FIELD } from '$shared/constants';
  import type { Language } from '$shared/services/i18n';
  import type { ColorScheme } from '$shared/types';

  /** translations */
  export let language: Language;
  export let colorScheme: ColorScheme;
  export let t = {
    name: 'Name',
    cta: 'Notify me',
  };
  export let name = '';
  export let email = '';

  export let nameError = '';
  export let emailError = '';
  export let turnstileError = '';
  // export let error = '';
</script>

<form class="notification-form" method="POST" use:enhance action="?/mail" autocomplete="on">
  <div class="relative">
    {#if nameError}
      <p class="error">
        {nameError}
      </p>
    {/if}
    <input
      class="c-input"
      type="text"
      name="name"
      bind:value={name}
      placeholder={t.name}
      required
    />
  </div>
  <div class="relative">
    {#if emailError}
      <p class="error">
        {emailError}
      </p>
    {/if}
    <input
      class="c-input"
      type="email"
      name="email"
      bind:value={email}
      placeholder="Email"
      required
    />
  </div>
  <button type="submit" class="c-btn">{t.cta}</button>
  <div class="relative col-span-3 w-full">
    {#if turnstileError}
      <p class="error">{turnstileError}</p>
    {/if}
    <div
      class="flex justify-end"
      turnstile-sitekey={PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
      turnstile-response-field-name={CLOUDFLARE_TURNSTILE_FORM_FIELD}
      turnstile-response-field
      turnstile-theme={colorScheme === 'system' ? 'auto' : colorScheme}
      turnstile-language={language}
      use:turnstile
    />
  </div>
</form>

<style lang="postcss">
  form {
    display: grid;
    gap: theme('spacing.2');

    @screen md {
      grid-template-columns: 1fr 1fr auto;
    }
  }

  .error {
    position: absolute;
    bottom: 100%;
    left: 0;

    padding-bottom: theme('spacing[0.5]');

    font-size: theme('fontSize.2xs');
    font-style: italic;
    color: theme('colors.status.error');
  }
</style>
