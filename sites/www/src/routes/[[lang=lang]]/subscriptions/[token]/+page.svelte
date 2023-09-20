<script lang="ts">
  import type { UpdateDomainSubscriptionRequestSchema } from '@internals/isc/mailer';
  import { superForm } from 'sveltekit-superforms/client';

  import type { FormMessage } from '$client/forms';
  import { noti } from '$client/notifications';

  import type { PageData } from './$types';

  export let data: PageData;

  $: t = data.translations.page;
  const { form, enhance, message } = superForm<
    typeof UpdateDomainSubscriptionRequestSchema,
    FormMessage
  >(data.form, {
    taintedMessage: null,
    multipleSubmits: 'prevent',
    delayMs: 500,
    timeoutMs: 1000,
    onError({ result }) {
      noti.error(result.error.message);
    },
  });

  $: if ($message) {
    switch ($message.type) {
      case 'error':
        noti.error($message.text);
        break;
      case 'success':
        noti.success($message.text);
        break;
      default:
        noti.info($message.text);
    }
  }
</script>

<main class="c-container-design flex-1">
  <h1 class="tp-h1 mt-8 pc:mt-[60px] uppercase">{t.title}</h1>
  <section class="mt-8 pc:mt-[60px]">
    <form action="?/update" method="POST" use:enhance class="space-y-6">
      <p>{t.form.emails.description}:</p>
      <div class="space-y-4 tb:ml-4">
        <label for="job" class="toggle-container">
          <input class="toggle" type="checkbox" name="job" id="job" bind:checked={$form.job} />
          <p>{t.form.emails.job}</p>
        </label>
        <label for="event" class="toggle-container">
          <input
            class="toggle"
            type="checkbox"
            name="event"
            id="event"
            bind:checked={$form.event}
          />
          <p>{t.form.emails.event}</p>
        </label>
      </div>
      <button class="c-btn" type="submit">{t.form.submit}</button>
    </form>
  </section>
</main>

<style lang="postcss">
  :global(body) {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
  }

  .toggle-container {
    display: flex;
    gap: 12px;
    align-items: center;
    width: fit-content;
  }

  .toggle {
    /* taken from Daisy UI Toggle component */
    --handle-sign: -1;
    --handle-offset: calc(1.5rem * var(--handle-sign));
    --toggle-bg: theme('colors.design.bg.1');
    --toggle-fg: theme('colors.design.fg.1');

    cursor: pointer;

    width: 3rem;
    height: 1.5rem;

    appearance: none;
    background-color: var(--toggle-fg);
    border-color: var(--toggle-fg);
    border-width: 1px;
    border-radius: 1.9rem;
    box-shadow:
      var(--handle-offset) 0 0 2px var(--toggle-bg) inset,
      0 0 0 2px var(--toggle-bg) inset,
      0 0;

    transition:
      background,
      box-shadow 200ms ease-out;

    &:checked {
      --handle-sign: 1;
    }
  }
</style>
