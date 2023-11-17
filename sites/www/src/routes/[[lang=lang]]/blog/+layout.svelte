<script lang="ts">
  import { intersect } from '$client/actions/intersect';
  import { MailRegistrationForm } from '$client/components/MailRegistrationForm';

  import type { LayoutData } from './$types';

  export let data: LayoutData;

  $: tMail = data.translations.mail;
  $: t = data.translations.layout;
</script>

<slot />

<div class="c-container-design pb-[120px] tb:pb-[200px]" use:intersect>
  <div
    class="mt-[60px] tb:mt-[160px] grid grid-cols-1 tb:grid-cols-[3fr,2fr] p-8 tb:p-10 border border-current rounded-[16px] gap-8 tb:gap-20 lg:gap-32"
  >
    <div class="space-y-6">
      <p class="tp-h3 font-medium">{t.title}</p>
      <p>{t.description}</p>
      <svg
        inline-src="../roadmap/_page/images/key-visuals.svg"
        class="opacity-5 max-w-full"
        height="100"
        width="328"
      />
    </div>
    <MailRegistrationForm
      t={tMail}
      superValidated={data.mailForm}
      action="/{data.language}/blog?/mail"
    />
  </div>
</div>
