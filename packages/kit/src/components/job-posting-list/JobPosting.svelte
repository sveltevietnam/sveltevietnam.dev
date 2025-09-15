<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import { formatDate } from '@sveltevietnam/kit/utilities/datetime';

	import fallback1x1 from '../../assets/images/fallbacks/1x1.jpg?enhanced&w=w=224;112&imagetools';

	import type { JobPostingProps } from '.';

	let { i18n, posting, class: cls, ...rest }: JobPostingProps = $props();

	let image = $derived(posting.employer.image ?? fallback1x1);

	const imageClasses = '@md:row-span-4';
</script>

<div class="@container">
	<article
		class={[
			'@md:gap-y-2 @md:gap-x-6 grid grid-cols-[auto_1fr] grid-rows-[auto_auto_auto_auto] gap-4',
			'@md:p-6 border-outline border p-4',
			cls,
		]}
		{...rest}
	>
		<!-- image -->
		{#snippet imageContent()}
			<enhanced:img class="@md:h-31 aspect-square h-20 w-auto" src={image} alt="" />
		{/snippet}
		{#if posting.href}
			<a class={['c-link-image', imageClasses]} href={posting.href} aria-hidden="true">
				{@render imageContent()}
			</a>
		{:else}
			<div class={imageClasses} aria-hidden="true">
				{@render imageContent()}
			</div>
		{/if}

		<!-- title -->
		<p class="c-text-title-sm @max-md:col-span-2 font-bold">
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
		<p class="@max-md:col-start-2 @max-md:row-start-1 self-center">
			<strong>{posting.type}</strong>
			<br class="@md:hidden" />
			<T message={i18n.at} />
			{#if posting.employer.website}
				<a class="c-link-preserved" href={posting.employer.website} data-external>
					<strong>{posting.employer.name}</strong>
				</a>
			{:else}
				<strong>{posting.employer.name}</strong>
			{/if}
		</p>

		<!-- location & salary -->
		<div class="@max-md:col-span-2 flex flex-wrap gap-x-6 gap-y-2">
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
			class="text-on-surface-subtle border-outline c-text-body-sm @max-md:col-span-2 flex flex-wrap
			items-center justify-between gap-x-4
			gap-y-2 border-t pt-1"
		>
			<p>
				<T message={i18n.postedAt} />
				{formatDate(posting.postedAt)}
			</p>
			<p>
				<T message={i18n.expiredAt} />
				{formatDate(posting.expiredAt)}
			</p>
		</div>
	</article>
</div>
