<script lang="ts">
	import { T } from '@sveltevietnam/i18n-new';

	import { formatDate } from '@sveltevietnam/kit/utilities/datetime';

	import fallback1x1 from '../../assets/images/fallbacks/1x1.jpg?enhanced&w=w=224;112&imagetools';

	import type { JobPostingProps } from '.';

	let { posting, class: cls, containerClass, ...rest }: JobPostingProps = $props();

	const imageContainerClasses = '@md:row-span-4 shrink-0';
</script>

<div class={['@container', containerClass]}>
	<article
		class={[
			'grid grid-cols-[auto_1fr] grid-rows-[auto_auto_auto_auto] gap-4 @md:gap-x-6 @md:gap-y-2',
			'border-outline border p-4 @md:p-6',
			cls,
		]}
		{...rest}
	>
		<!-- image -->
		{#snippet imageContent()}
			{@const classes = '@md:h-31 aspect-square h-20 w-auto'}
			{#if posting.employer.image}
				<img class={classes} width="80" height="80" src={posting.employer.image} alt="" />
			{:else}
				<enhanced:img class={classes} src={fallback1x1} alt="" />
			{/if}
		{/snippet}
		{#if posting.href}
			<a class={['c-link-image', imageContainerClasses]} href={posting.href} aria-hidden="true">
				{@render imageContent()}
			</a>
		{:else}
			<div class={imageContainerClasses} aria-hidden="true">
				{@render imageContent()}
			</div>
		{/if}

		<!-- title -->
		<p class="c-text-title-sm font-bold @max-md:col-span-2">
			{#snippet titleContent()}
				{posting.title}
			{/snippet}

			{#if posting.href}
				<a class="c-link-preserved relative" href={posting.href}>
					{@render titleContent()}
					<i class="not-can-hover:hidden i i-[ph--cursor-click] text-[0.8em]"></i>
				</a>
			{:else}
				{@render titleContent()}
			{/if}
		</p>

		<!-- job type & employer name -->
		<p class="self-center @max-md:col-start-2 @max-md:row-start-1">
			<strong>{posting.type}</strong>
			<br class="@md:hidden" />
			<T key="at" />
			{#if posting.employer.website}
				<a class="c-link-preserved" href={posting.employer.website} data-external>
					<strong>{posting.employer.name}</strong>
				</a>
			{:else}
				<strong>{posting.employer.name}</strong>
			{/if}
		</p>

		<!-- location & salary -->
		<div class="flex flex-wrap gap-x-6 gap-y-2 @max-md:col-span-2">
			<p class="flex items-center gap-2">
				<i class="i i-[ph--map-pin] h-6 w-6"></i>
				<span>{posting.location}</span>
			</p>
			<p class="flex items-center gap-2">
				<i class="i i-[ph--money] h-6 w-6"></i>
				<span>{posting.salary}</span>
			</p>
		</div>

		<!-- dates -->
		<div
			class="text-on-surface-subtle border-outline c-text-body-sm flex flex-wrap items-center
			justify-between gap-x-4 gap-y-2
			border-t pt-1 @max-md:col-span-2"
		>
			{#if posting.postedAt}
				<p>
					<T key="components.job_posting_list.posted_at" />
					{formatDate(posting.postedAt)}
				</p>
			{/if}
			<p>
				<T key="components.job_posting_list.expired_at" />
				{formatDate(posting.expiredAt)}
			</p>
		</div>
	</article>
</div>
