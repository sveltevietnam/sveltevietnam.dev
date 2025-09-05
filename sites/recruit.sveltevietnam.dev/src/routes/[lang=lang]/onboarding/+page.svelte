<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { Contexts } from '@sveltevietnam/kit/contexts';

	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import { SingleBoxPageLayout } from '$lib/components/single-box-page-layout';
	import { FormEmployerProfile } from '$lib/forms/employer-profile';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const { routing } = Contexts.get();
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
			<div class="flex gap-6">
				<a class="c-btn c-btn--outlined" href={p['/:lang/logout']({ lang: routing.lang })}>
					<span><T message={m['pages.onboarding.cta.use_another_account']} /></span>
				</a>
				<button class="c-btn" type="submit" data-delayed={delayed} data-timeout={timeout}>
					<span><T message={m['pages.onboarding.cta.submit']} /></span>
				</button>
			</div>
		{/snippet}
	</FormEmployerProfile>
</SingleBoxPageLayout>
