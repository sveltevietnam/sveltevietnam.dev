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
		class="mt-[60px] grid grid-cols-1 gap-8 rounded-[16px] border border-current p-8 lg:gap-32 tb:mt-[160px] tb:grid-cols-[3fr,2fr] tb:gap-20 tb:p-10"
	>
		<div class="space-y-6">
			<p class="tp-h3 font-medium">{t.title}</p>
			<p>{t.description}</p>
			<svg
				inline-src="../roadmap/_page/images/key-visuals.svg"
				class="max-w-full opacity-5"
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
