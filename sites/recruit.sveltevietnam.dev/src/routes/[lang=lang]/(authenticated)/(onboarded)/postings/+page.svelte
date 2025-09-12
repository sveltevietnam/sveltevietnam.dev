<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { JobPostingList, TBA, Breadcrumbs } from '@sveltevietnam/kit/components';
	import { Contexts } from '@sveltevietnam/kit/contexts';

	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const { routing } = Contexts.get();
</script>

<main
	class="max-w-pad mt-header pt-section pb-section-more tablet:space-y-8 desktop:space-y-10 flex-1 space-y-6"
>
	<Breadcrumbs
		crumbs={data.routing.breadcrumbs}
		i18n={{
			aria: m['components.breadcrumbs.aria'],
			home: m['components.breadcrumbs.home'],
		}}
	/>

	<div class="space-y-10">
		<div class="border-outline flex items-end justify-between gap-2 border-b">
			<h1 class="c-text-heading">
				<T message={m['pages.postings.heading']} />
			</h1>
			<a class="c-btn gap-2" href={p['/:lang/postings/create']({ lang: routing.lang })}>
				<T message={m['pages.postings.create']} />
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
				<p class="c-text-title-sm"><T message={m['pages.postings.tba.desc']} /></p>
				<p>
					<a class="c-link" href={p['/:lang/postings/create']({ lang: routing.lang })}>
						<T message={m['pages.postings.tba.cta']} />
					</a>
				</p>
			</TBA>
		{/if}
	</div>
</main>
