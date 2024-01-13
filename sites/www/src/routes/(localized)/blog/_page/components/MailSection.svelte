<script lang="ts" context="module">
	import type { ComponentProps } from 'svelte';

	import { getLangContext } from '$client/contexts/lang';
	import { MailRegistrationForm } from '$lib/components/MailRegistrationForm';

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
</script>

<script lang="ts">
	export let mailForm: ComponentProps<MailRegistrationForm>['superValidated'];
	export let mailT: ComponentProps<MailRegistrationForm>['t'];

	const langStore = getLangContext();
	$: lang = $langStore;

	$: t = translations[lang];
</script>

<div
	class="mt-[60px] grid grid-cols-1 gap-8 rounded-[16px] border border-current p-8 lg:gap-32 tb:mt-[160px] tb:grid-cols-[3fr,2fr] tb:gap-20 tb:p-10"
>
	<div class="space-y-6">
		<p class="c-text-h3 font-medium">{t.title}</p>
		<p>{t.description}</p>
		<svg
			inline-src="../../../roadmap/_page/images/key-visuals.svg"
			class="max-w-full opacity-5"
			height="100"
			width="328"
		/>
	</div>
	<MailRegistrationForm t={mailT} superValidated={mailForm} action="/{lang}/blog?/mail" />
</div>
