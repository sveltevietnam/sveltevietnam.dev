<script lang="ts" context="module">
  import { z } from 'zod';
  export const mailSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    turnstile: z.string().min(1),
  });
  export type MailSchema = typeof mailSchema;
</script>

<script lang="ts">
  import type { SuperValidated } from 'sveltekit-superforms';
  import { superForm } from 'sveltekit-superforms/client';

  import { turnstile } from '$client/actions/turnstile';
  import { noti } from '$client/notifications';
  import { PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY } from '$env/static/public';
  import type { Language } from '$shared/services/i18n';
  import type { ColorScheme } from '$shared/types';

  /** translations */
  export let superValidated: SuperValidated<MailSchema>;
  export let language: Language;
  export let colorScheme: ColorScheme;
  export let t = {
    name: 'Name',
    cta: 'Notify me',
  };

  const { form, enhance, constraints, errors, delayed, message } = superForm<MailSchema, string>(
    superValidated,
    {
      taintedMessage: null,
      multipleSubmits: 'prevent',
      delayMs: 500,
      onError({ result }) {
        noti.error(result.error.message);
      },
    },
  );

  $: if ($message) {
    noti.success($message);
  }
</script>

<form class="notification-form" method="POST" use:enhance action="?/mail" autocomplete="on">
  <div class="relative">
    {#if $errors.name?.length}
      <p class="error">
        {$errors.name[0]}
      </p>
    {/if}
    <input
      class="c-input"
      type="text"
      name="name"
      placeholder={t.name}
      autocomplete="name"
      bind:value={$form.name}
      {...$constraints.name}
    />
  </div>
  <div class="relative">
    {#if $errors.email?.length}
      <p class="error">
        {$errors.name?.[0]}
      </p>
    {/if}
    <input
      class="c-input"
      type="email"
      name="email"
      placeholder="Email"
      autocomplete="email"
      bind:value={$form.email}
      {...$constraints.email}
    />
  </div>
  <button type="submit" class="c-btn" data-loading={$delayed}>
    {t.cta}
  </button>
  <div class="relative col-span-3 w-full">
    {#if $errors.turnstile?.length}
      <p class="error">{$errors.turnstile[0]}</p>
    {/if}
    <div
      class="flex justify-end"
      turnstile-sitekey={PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
      turnstile-theme={colorScheme === 'system' ? 'auto' : colorScheme}
      turnstile-response-field-name="turnstile"
      turnstile-response-field
      turnstile-language={language}
      use:turnstile
      on:turnstile={(e) => ($form.turnstile = e.detail)}
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
