<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import * as m from '$data/locales/generated/messages';
	import { SingleBoxPageLayout } from '$lib/components/single-box-page-layout';
	import { FormEmployerProfile } from '$lib/forms/employer-profile';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<SingleBoxPageLayout class="max-w-readable space-y-6">
	<h1 class="c-text-heading-md">
		<T message={m['pages.onboarding.heading']} />
	</h1>
	<p class="leading-relaxed">
		<T message={m['pages.onboarding.desc']} />
	</p>

	<FormEmployerProfile data={data.form} action="?/onboard">
		{#snippet cta({ delayed, timeout })}
			<button class="c-btn c-btn--pop" type="submit" data-delayed={delayed} data-timeout={timeout}>
				<T message={m['pages.onboarding.submit']} />
			</button>
		{/snippet}
	</FormEmployerProfile>
</SingleBoxPageLayout>
