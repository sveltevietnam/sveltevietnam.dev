<script lang="ts">
	import { T } from '@sveltevietnam/i18n-new';
	import { Contexts } from '@sveltevietnam/kit/contexts';

	import * as p from '$data/routes/generated';
	import { SingleBoxPageLayout } from '$lib/components/single-box-page-layout';

	import type { PageProps } from './$types';
	import svgKeyVisual from './_local/images/key-visual.svg';

	let { data }: PageProps = $props();

	const { routing } = Contexts.get();
</script>

<SingleBoxPageLayout class="max-w-readable text-center">
	<div class="tablet:-mx-10 space-y-10">
		<div class="tablet:px-10 space-y-6">
			<h1 class="c-text-heading-md">
				{#if data.status === 'ok'}
					<T key="pages.email_change_verification.heading.ok" />
				{:else if data.status === 'invalid'}
					<T key="pages.email_change_verification.heading.invalid" />
				{:else if data.status === 'expired'}
					<T key="pages.email_change_verification.heading.expired" />
				{:else}
					<T key="pages.email_change_verification.heading.unknown" />
				{/if}
			</h1>

			<p data-testid="result">
				{#if data.status === 'ok'}
					<T key="pages.email_change_verification.desc.ok" />
				{:else if data.status === 'invalid'}
					<T key="pages.email_change_verification.desc.invalid" />
				{:else if data.status === 'expired'}
					<T
						key="pages.email_change_verification.desc.expired"
						params={{ profilePath: p['/:lang/profile']({ lang: routing.lang }) }}
					/>
				{:else}
					<T key="errors.generic" />
				{/if}
			</p>
		</div>

		{#if !data.user && data.status === 'ok'}
			<a
				class="c-btn c-btn--pop mx-auto block w-fit"
				href={p['/:lang/authenticate']({ lang: routing.lang })}
			>
				<T key="pages.email_change_verification.login" />
			</a>
		{/if}

		<img class="h-auto w-full" width="726" height="292" alt="" src={svgKeyVisual} />

		<p class="tablet:px-10 mt-10">
			<T key="pages.email_change_verification.reminder" />
		</p>
	</div>
</SingleBoxPageLayout>
