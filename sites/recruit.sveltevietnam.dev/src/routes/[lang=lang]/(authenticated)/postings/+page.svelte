<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { JobPostingList, TBA } from '@sveltevietnam/kit/components';
	import { RoutingContext } from '@sveltevietnam/kit/contexts';

	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const routing = RoutingContext.get();
</script>

<main class="max-w-pad flex-1 py-40">
	<h1 class="sr-only"><T message={m['pages.dashboard.heading']} /></h1>

	<div class="tablet:space-y-10 max-w-pad z-1 relative space-y-8">
		<!-- <Breadcrumbs crumbs={data.routing.breadcrumbs} /> -->
	</div>

	<section class="space-y-10">
		<div class="border-outline flex items-end justify-between gap-2 border-b">
			<h2 class="c-text-heading">
				<T message={m['pages.dashboard.postings.heading']} />
			</h2>
			<a class="c-btn gap-2" href={p['/:lang/postings/create']({ lang: routing.lang })}>
				<T message={m['pages.dashboard.postings.create']} />
				<i class="i i-[ph--plus] h-6 w-6"></i>
			</a>
		</div>

		{#if data.postings.length > 0}
			<JobPostingList
				postings={data.postings}
				i18n={{
					at: m['at'],
					postedAt: m['components.job_posting_list.posted_at'],
					expiredAt: m['components.job_posting_list.expired_at'],
				}}
			/>
		{:else}
			<TBA class="mx-auto w-fit">
				<p class="c-text-title-sm"><T message={m['pages.dashboard.postings.tba.desc']} /></p>
				<p>
					<a class="c-link" href={p['/:lang/postings/create']({ lang: routing.lang })}>
						<T message={m['pages.dashboard.postings.tba.cta']} />
					</a>
				</p>
			</TBA>
		{/if}
	</section>
</main>
