<script lang="ts">
	import { intersect } from '$client/actions/intersect';
	import { BlogPostItem } from '$client/components/BlogPostItem';
	import { Breadcrumbs } from '$client/components/Breadcrumbs';
	import { ConsecutiveFadeUpIntro } from '$client/components/ConsecutiveFadeUpIntro';
	import { ExternalBlogPostItem } from '$client/components/ExternalBlogPostItem';
	import { SplitText } from '$client/components/SplitText';
	import ToBeAnnounced from '$client/components/ToBeAnnounced/ToBeAnnounced.svelte';

	import type { PageData } from './$types';
	import keyVisuals from './_page/images/key-visuals.png?enhanced';

	export let data: PageData;

	$: t = data.translations.page;
	$: issueTemplateLinks = data.issueTemplateLinks;

	function splitPosts(posts: typeof data.posts) {
		const { internal, external } = posts;
		return {
			topPosts: internal.slice(0, 3),
			otherPosts: internal.slice(3),
			topExternalPost: external.at(0),
			otherExternalPosts: external.slice(1),
		};
	}
	$: ({ topPosts, otherPosts, topExternalPost, otherExternalPosts } = splitPosts(data.posts));
</script>

<main>
	<div class="max-w-pad mt-6" use:intersect>
		<Breadcrumbs breadcrumbs={data.breadcrumbs} />
	</div>
	<section
		class="max-w-pad mb-[80px] tb:mb-[120px] tb:flex tb:flex-row tb:justify-between"
		use:intersect
	>
		<div class="mt-8 tb:mt-[100px]">
			<h1 class="c-text-h1 uppercase">{t.title}</h1>
			<p class="c-text-h4 mt-6 tb:mt-8">{t.subtitle}</p>
		</div>
		<div class="sp:mt-8 tb:mt-6">
			<enhanced:img
				src={keyVisuals}
				alt="a blog page coming out of a hole"
				class="h-auto w-full max-w-[532px]"
			/>
		</div>
	</section>
	<div class="space-y-[60px] tb:space-y-[120px]">
		{#if topPosts.length || topExternalPost}
			<section class="max-w-pad tb:gap-[60px]">
				<ConsecutiveFadeUpIntro selector=".char">
					<h2 class="c-text-h2 uppercase">
						<SplitText text={t.recent.title} />
					</h2>
				</ConsecutiveFadeUpIntro>
				<div class="mt-10 flex gap-10 upto-tb:flex-col">
					<div class="flex-1">
						{#if topPosts[0]}
							<div use:intersect>
								<BlogPostItem post={topPosts[0]} alwaysVertical />
							</div>
						{/if}
					</div>
					<div class="flex-1 space-y-10">
						{#each topPosts.slice(1) as post}
							<div use:intersect class="before:mb-10 before:separator first-of-type:before:hidden">
								<BlogPostItem {post} />
							</div>
						{/each}
						{#if topExternalPost}
							<div use:intersect class="before:mb-10 before:separator">
								<ExternalBlogPostItem post={topExternalPost} />
							</div>
						{/if}
					</div>
				</div>
			</section>
		{/if}

		<div class="gradient-wrapper max-w-pad grid grid-cols-1 gap-[60px] pc:grid-cols-2">
			<section>
				<ConsecutiveFadeUpIntro selector=".char">
					<h2 class="c-text-h2 uppercase">
						<SplitText text={t.introduction.title} />
					</h2>
				</ConsecutiveFadeUpIntro>
				<div class="mt-6 space-y-4" use:intersect>
					{#each t.introduction.description as p}
						<p>{@html p}</p>
					{/each}
				</div>
			</section>
			<section>
				<ConsecutiveFadeUpIntro selector=".char">
					<h2 class="c-text-h2 uppercase">
						<SplitText text={t.contribute.title} />
					</h2>
				</ConsecutiveFadeUpIntro>
				<p use:intersect class="mt-6">{t.contribute.description}</p>
				<ul class="divider-border mt-4 max-w-[548px] divide-y font-medium" use:intersect>
					<li>
						<a href={issueTemplateLinks.proposePost} class="c-link c-link--box" external>
							<span>{t.contribute.links.proposePost}</span>
						</a>
					</li>
					<li>
						<a href={issueTemplateLinks.requestExternalPost} class="c-link c-link--box" external>
							<span>{t.contribute.links.requestExternalPost}</span>
						</a>
					</li>
					<li>
						<a
							href="https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/docs/DEV_BLOG_POST.md"
							class="c-link c-link--box"
							external
						>
							<span>{t.contribute.links.readCodeGuidelines}</span>
						</a>
					</li>
				</ul>
				<p class="mt-4" use:intersect>{@html t.contribute.contact}</p>
			</section>
		</div>

		<div class="max-w-pad grid grid-cols-1 gap-[60px] tb:grid-cols-[2fr,1fr]">
			<section>
				<ConsecutiveFadeUpIntro selector=".char">
					<h2 class="c-text-h2 uppercase after:mt-2 after:separator">
						<SplitText text={t.posts.title} />
					</h2>
				</ConsecutiveFadeUpIntro>
				{#if otherPosts.length}
					<ul class="mt-10 space-y-10">
						{#each otherPosts as post}
							<li class="before:mb-10 before:separator first-of-type:before:hidden" use:intersect>
								<BlogPostItem {post} />
							</li>
						{/each}
					</ul>
				{:else}
					<div use:intersect class="mt-10">
						<ToBeAnnounced class="text-center">
							<p class="c-text-h4">
								{t.posts.tba.description}
							</p>
							<p class="mt-4">
								<a href={issueTemplateLinks.proposePost} class="c-link" external
									>{t.posts.tba.cta}</a
								>
							</p>
						</ToBeAnnounced>
					</div>
				{/if}
			</section>
			<div>
				<section>
					<ConsecutiveFadeUpIntro selector=".char">
						<h2 class="c-text-h2 uppercase after:mt-2 after:separator">
							<SplitText text={t.externalPosts.title} />
						</h2>
					</ConsecutiveFadeUpIntro>
					{#if otherExternalPosts.length}
						<ul class="mt-10 space-y-10">
							{#each otherExternalPosts as post}
								<li class="before:mb-10 before:separator first-of-type:before:hidden" use:intersect>
									<ExternalBlogPostItem {post} />
								</li>
							{/each}
						</ul>
					{:else}
						<div use:intersect class="mt-10">
							<ToBeAnnounced class="text-center">
								<p class="c-text-h4">
									{t.externalPosts.tba.description}
								</p>
								<p class="mt-4">
									<a href={issueTemplateLinks.requestExternalPost} class="c-link" external
										>{t.externalPosts.tba.cta}</a
									>
								</p>
							</ToBeAnnounced>
						</div>
					{/if}
				</section>
			</div>
		</div>
	</div>
</main>

<style lang="postcss">
	.gradient-wrapper {
		--gradient-height: 160px;
		--gradient-offset: 80px;

		position: relative;

		&::before {
			pointer-events: none;
			content: '';

			position: absolute;
			z-index: -1;
			top: calc(var(--gradient-offset) - var(--gradient-height));
			right: 0;
			bottom: calc(var(--gradient-offset) - var(--gradient-height));
			left: 0;

			background: linear-gradient(
				to bottom,
				transparent,
				theme('colors.neutral.DEFAULT') var(--gradient-offset),
				theme('colors.neutral.DEFAULT') calc(100% - var(--gradient-offset)),
				transparent
			);
		}

		@screen tb {
			--gradient-height: 280px;
			--gradient-offset: 132px;
		}
	}
</style>
