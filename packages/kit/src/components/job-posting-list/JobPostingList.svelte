<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import { formatDate } from '@sveltevietnam/kit/utilities/datetime';

	import fallback1x1 from '../../assets/images/fallbacks/1x1.jpg?enhanced&w=w=224;112&imagetools';

	import type { JobPostingListProps, JobPosting } from '.';

	let { i18n, postings, class: cls, ...rest }: JobPostingListProps = $props();
</script>

{#snippet posting(data: JobPosting)}
	{@const avatarUrl = data.employer.avatarUrl ?? fallback1x1}
	<li class="@container">
		<article class="grid grid-cols-[auto_1fr] grid-rows-[auto_auto_auto_auto] gap-x-4 gap-y-1">
			<!-- image -->
			<a class="c-link-image @md:row-span-4 row-span-2" href={data.href} aria-hidden="true">
				<enhanced:img class="@md:h-28 aspect-square h-14 w-auto" src={avatarUrl} alt="" />
			</a>

			<!-- title -->
			<p class="c-text-title-sm font-bold leading-none">
				<a class="c-link-preserved relative" href={data.href}>
					{data.title}
					<i class="not-can-hover:hidden i i-[ph--cursor-click] text-[0.8em]"></i>
				</a>
			</p>

			<!-- job type & employer name -->
			<p>
				<strong>{data.type}</strong>
				<span class="c-text-body-sm"><T message={i18n.at} /></span>
				<strong>{data.employer.name}</strong>
			</p>

			<!-- location & salary -->
			<p class="@max-md:col-span-2">
				<span>{data.location}</span>
				<span>•</span>
				<span>{data.salary}</span>
			</p>

			<!-- dates -->
			<p class="@max-md:col-span-2">
				<span>
					<T message={i18n.postedAt} />
					{formatDate(data.postedAt)}
				</span>
				<span>•</span>
				<span>
					<T message={i18n.expiredAt} />
					{formatDate(data.expiredAt)}
				</span>
			</p>
		</article>
	</li>
{/snippet}

<ul class={['tablet:grid-cols-2 desktop:gap-10 grid grid-cols-1 gap-8', cls]} {...rest}>
	{#each postings as p (p.id)}
		{@render posting(p)}
	{/each}
</ul>
