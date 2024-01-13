<script lang="ts">
	import type { Project } from '$shared/types';

	export let project: Project;
</script>

<article class="project-card">
	<div class="c-graphic flex-shrink-0 md:h-[400px] md:w-[400px]" />
	<div class="space-y-4 md:space-y-8 md:py-10">
		<div class="flex items-center space-x-4">
			<p class="title">{project.name}</p>
			<!-- <svg inline-src="google/eco" /> -->
		</div>
		<p class="space-x-4">
			<!-- <svg inline-src="google/diversity-1" class="inline-block" /> -->
			<span>
				{project.description}
			</span>
		</p>
		{#if project.by}
			<p class="space-x-4">
				<!-- <svg inline-src="google/handshake" class="inline-block" /> -->
				<span>
					{project.by}
				</span>
			</p>
		{/if}
		{#if project.href}
			<a href={project.href} class="c-btn c-btn--with-icon c-btn--text w-fit" external>
				<span>View details</span>
				<!-- <svg inline-src="google/arrow-right-alt" /> -->
			</a>
		{/if}
	</div>
</article>

<style lang="postcss">
	.project-card {
		display: flex;

		@screen upto-tb {
			flex-direction: column;
		}
	}

	.title {
		font-size: 28px;
		font-weight: theme('fontWeight.bold');
	}
</style>
