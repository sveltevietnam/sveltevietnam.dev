<script lang="ts">
	import type { Contributor } from '$shared/types';

	import ContributorLink from './ContributorLink.svelte';

	export let contributor: Contributor;
</script>

<article class="job-card">
	<div class="c-avatar" />
	<div class="space-y-2">
		<p class="md:space-x-2">
			<span class="font-bold">{contributor.fullName}</span>
			{#if contributor.affiliation}
				<br class="md:hidden" />
				<span class="tp-cap2 italic">{contributor.affiliation}</span>
			{/if}
		</p>
		<p>{contributor.contribution}</p>
		{#if contributor.links}
			<ul class="flex items-center space-x-4">
				{#each Object.entries(contributor.links) as [ref, href]}
					<li>
						<a {href} title="ref" external>
							<ContributorLink {ref} />
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</article>

<style lang="postcss">
	.c-avatar {
		width: 100px;
		height: 100px;
	}

	.job-card {
		display: grid;
		grid-template-columns: auto 1fr;
		column-gap: theme('spacing.4');
		align-items: center;
	}
</style>
