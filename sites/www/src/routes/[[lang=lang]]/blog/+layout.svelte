<script lang="ts">
  import { MailRegistrationForm } from '$client/components/MailRegistrationForm';

  import type { LayoutData } from './$types';

  export let data: LayoutData;

  const translations = {
    vi: {
      mailingListCall: 'Đăng kí nhận thông báo bài viết mới từ Blog của Svelte Việt Nam',
    },
    en: {
      mailingListCall:
        'Register to receive notification about new posts from the Svelte Vietnam Blog',
    },
  };

  $: tMail = data.translations.mail;
  $: t = translations[data.language];
</script>

<slot />

<div class="c-container-design pb-[120px] tb:pb-[200px]">
  <div class="mt-[160px] grid grid-cols-[2fr,1fr] p-10 border border-current rounded-[20px] gap-10">
    <p class="tp-h2 font-medium">{t.mailingListCall}</p>
    <MailRegistrationForm
      t={tMail}
      language={data.language}
      colorScheme={data.colorScheme}
      superValidated={data.mailForm}
      action="/{data.language}/blog?/mail"
    />
  </div>
</div>
