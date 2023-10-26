<script lang="ts">
  import { intersect } from '$client/actions/intersect';
  import { MailRegistrationForm } from '$client/components/MailRegistrationForm';

  import type { LayoutData } from './$types';

  export let data: LayoutData;

  const translations = {
    vi: {
      title: 'Bản tin Blog Svelte Việt Nam',
      description: 'Đăng ký nhận thông báo để không bỏ lỡ bài viết mới từ Svelte Việt Nam',
    },
    en: {
      title: 'The Svelte Vietnam Blog Newsletter',
      description: 'Subscribe to receive notification for new blog post from Svelte Vietnam',
    },
  };

  $: tMail = data.translations.mail;
  $: t = translations[data.language];
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
        class="opacity-5"
        height="100"
        width="328"
      />
    </div>
    <MailRegistrationForm
      t={tMail}
      language={data.language}
      superValidated={data.mailForm}
      action="/{data.language}/blog?/mail"
    />
  </div>
</div>
