<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { JobPostingList, TBA, Breadcrumbs } from '@sveltevietnam/kit/components';
	import { Contexts } from '@sveltevietnam/kit/contexts';

	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import { VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN } from '$env/static/public';

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

	<h1 class="sr-only">
		<T message={m['pages.postings.heading']} />
	</h1>

	<div class="space-y-section">
		<div class="space-y-10">
			<div class="border-outline flex items-end justify-between gap-2 border-b">
				<h2 class="c-text-heading">
					<T message={m['pages.postings.active.heading']} />
				</h2>
				<a class="c-btn gap-2" href={p['/:lang/postings/create']({ lang: routing.lang })}>
					<T message={m['pages.postings.active.create']} />
					<i class="i i-[ph--plus] h-6 w-6"></i>
				</a>
			</div>

			{#if data.active.length > 0}
				<JobPostingList
					postings={data.active}
					i18n={{
						at: m['at'],
						createdAt: m['components.job_posting_list.created_at'],
						expiredAt: m['components.job_posting_list.expired_at'],
					}}
				/>
			{:else}
				<TBA class="mx-auto w-fit">
					<p class="c-text-title-sm"><T message={m['pages.postings.active.tba.desc']} /></p>
					<p>
						<a class="c-link" href={p['/:lang/postings/create']({ lang: routing.lang })}>
							<T message={m['pages.postings.active.tba.cta']} />
						</a>
					</p>
				</TBA>
			{/if}
		</div>

		{#if data.pending.length > 0}
			<div class="space-y-10">
				<div class="space-y-6">
					<h2 class="c-text-heading border-outline border-b">
						<T message={m['pages.postings.pending.heading']} />
					</h2>
					<p>
						<T message={m['pages.postings.pending.desc']} />
					</p>
				</div>
				<JobPostingList
					postings={data.pending}
					i18n={{
						at: m['at'],
						createdAt: m['components.job_posting_list.created_at'],
						expiredAt: m['components.job_posting_list.expired_at'],
					}}
				/>
			</div>
		{/if}

		{#if data.expired.length > 0}
			<div class="space-y-10">
				<div class="space-y-6">
					<h2 class="c-text-heading border-outline border-b">
						<T message={m['pages.postings.expired.heading']} />
					</h2>
					<p>
						<T
							message={m['pages.postings.expired.desc']}
							mainSiteUrl={VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN}
						/>
					</p>
				</div>
				<JobPostingList
					postings={data.expired}
					i18n={{
						at: m['at'],
						createdAt: m['components.job_posting_list.created_at'],
						expiredAt: m['components.job_posting_list.expired_at'],
					}}
				/>
			</div>
		{/if}
	</div>
</main>
