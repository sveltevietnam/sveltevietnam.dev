<script lang="ts" context="module">
	import type { ComponentProps } from 'svelte';

	import { MailRegistrationForm } from '$lib/components/MailRegistrationForm';
	import { getLangContext } from '$lib/contexts/lang';

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

	const { lang } = getLangContext();

	$: t = translations[$lang];
</script>

<div
	class="mt-[60px] grid grid-cols-1 gap-8 rounded-2xl border border-current p-8 lg:gap-32 tb:mt-[160px] tb:grid-cols-[3fr,2fr] tb:gap-20 tb:p-10"
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
	<MailRegistrationForm t={mailT} superValidated={mailForm} action="/{$lang}/blog?/mail" />
</div>
