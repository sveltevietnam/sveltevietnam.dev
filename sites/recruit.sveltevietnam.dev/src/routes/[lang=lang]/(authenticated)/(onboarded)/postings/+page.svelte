<script lang="ts">
	import { T } from '@sveltevietnam/i18n-new';
	import { JobPostingList, TBA, Breadcrumbs } from '@sveltevietnam/kit/components';
	import { Contexts } from '@sveltevietnam/kit/contexts';

	import * as p from '$data/routes/generated';
	import { VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN } from '$env/static/public';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const { routing } = Contexts.get();
</script>

<main
	class="max-w-pad mt-header pt-section pb-section-more tablet:space-y-8 desktop:space-y-10 flex-1 space-y-6"
>
	<Breadcrumbs crumbs={data.routing.breadcrumbs} />

	<h1 class="sr-only">
		<T key="pages.postings.heading" />
	</h1>

	<div class="space-y-section">
		<section class="space-y-10" aria-labelledby="active-job-postings">
			<div class="space-y-6">
				<div class="flex items-end justify-between">
					<h2 class="c-text-heading border-outline flex-1 border-b" id="active-job-postings">
						<T key="pages.postings.active.heading" />
					</h2>
					<a
						class="c-btn gap-2 whitespace-nowrap"
						href={p['/:lang/postings/create']({ lang: routing.lang })}
					>
						<T key="pages.postings.active.create" />
						<i class="i i-[ph--plus] h-6 w-6"></i>
					</a>
				</div>

				<p>
					<T
						key="pages.postings.active.desc"
						params={{ mainSiteUrl: VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN }}
					/>
				</p>
			</div>

			{#if data.active.length > 0}
				<JobPostingList postings={data.active} />
			{:else}
				<TBA class="mx-auto w-fit" role="note">
					<p class="c-text-title-sm"><T key="pages.postings.active.tba.desc" /></p>
					<p>
						<a class="c-link" href={p['/:lang/postings/create']({ lang: routing.lang })}>
							<T key="pages.postings.active.tba.cta" />
						</a>
					</p>
				</TBA>
			{/if}
		</section>

		{#if data.pending.length > 0}
			<section class="space-y-10" aria-labelledby="pending-job-postings">
				<div class="space-y-6">
					<h2 class="c-text-heading border-outline border-b" id="pending-job-postings">
						<T key="pages.postings.pending.heading" />
					</h2>
					<p>
						<T key="pages.postings.pending.desc" />
					</p>
				</div>
				<JobPostingList postings={data.pending} />
			</section>
		{/if}

		{#if data.expired.length > 0}
			<section class="space-y-10" aria-labelledby="expired-job-postings">
				<div class="space-y-6">
					<h2 class="c-text-heading border-outline border-b" id="expired-job-postings">
						<T key="pages.postings.expired.heading" />
					</h2>
					<p>
						<T
							key="pages.postings.expired.desc"
							params={{ mainSiteUrl: VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN }}
						/>
					</p>
				</div>
				<JobPostingList postings={data.expired} />
			</section>
		{/if}
	</div>
</main>
