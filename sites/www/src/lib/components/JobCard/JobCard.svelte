<script lang="ts">
	import { getLangContext } from '$client/contexts/lang';
	import companyFallbackImg from '$lib/assets/images/fallback/default.jpg?w=80&format=webp&imagetools';
	import type { Job } from '$lib/types';

	import { translations } from './translation';

	export let job: Job;
	let cls = '';
	export { cls as class };

	const langStore = getLangContext();
	$: lang = $langStore;

	$: t = translations[lang];
	$: tags = [!!job.sponsor && t.sponsored, job.salary, job.location, job.locationPolicy].filter(
		Boolean,
	);
</script>

<article class="job-card {cls}">
	<a href={job.href} external class="contents">
		<img src={job.image || companyFallbackImg} alt={job.company} height="80" width="80" />
	</a>
	<div class="details">
		<p class="font-medium">
			<svg inline-src="icon/building" width="16" height="16" class="inline-block" />
			{job.company}
		</p>
		<p class="datetime">
			<span>{t.posted}</span>
			<time datetime={job.createdAt}>{new Date(job.createdAt).toLocaleDateString()}</time>
			{#if job.expiresAt}
				<span aria-disabled>-</span>
				<span>{t.expires}</span>
				<time datetime={job.expiresAt}>{new Date(job.expiresAt).toLocaleDateString()}</time>
			{/if}
		</p>
		<p class="c-text-h5 mt-3 w-fit font-medium">
			<a class="c-link c-link--preserved" href={job.href} external>{job.title}</a>
		</p>
	</div>
	<div class="tags">
		{#each tags as tag}
			<p class="c-tag">{tag}</p>
		{/each}
	</div>
</article>

<style lang="postcss">
	.job-card {
		display: grid;
		grid-template-areas:
			'img details'
			'tags tags';
		grid-template-columns: auto 1fr;
		grid-template-rows: auto auto;
		row-gap: 16px;
		column-gap: 24px;
	}

	img {
		grid-area: img;
	}

	.details {
		grid-area: details;
	}

	.datetime {
		margin-top: 6px;
		color: theme('colors.fg.200');
	}

	.tags {
		display: flex;
		grid-area: tags;
		flex-wrap: wrap;
		gap: 8px;

		height: fit-content;
	}
</style>
