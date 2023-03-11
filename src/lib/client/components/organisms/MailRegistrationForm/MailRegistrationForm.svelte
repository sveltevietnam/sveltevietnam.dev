<script lang="ts">
  import { enhance } from '$app/forms';

  /** translations */
  export let t = {
    name: 'Name',
    cta: 'Notify me',
  };
  export let name = '';
  export let nameError = '';
  export let email = '';
  export let emailError = '';
  export let error = '';
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
