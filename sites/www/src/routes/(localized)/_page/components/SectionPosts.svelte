<script lang="ts">
	import { AnimatedArrowCircle } from '$client/components/AnimatedArrowCircle';
	import { BlogPostItem } from '$client/components/BlogPostItem';
	import { ConsecutiveFadeUpIntro } from '$client/components/ConsecutiveFadeUpIntro';
	import ExternalBlogPostItem from '$client/components/ExternalBlogPostItem/ExternalBlogPostItem.svelte';
	import { SplitText } from '$client/components/SplitText';
	import { getLangContext } from '$client/contexts/lang';
	import { getNavigationContext } from '$client/contexts/navigation';
	import { intersect } from '$lib/actions/intersect';
	import type { LocalizedExternalPost, LocalizedPost } from '$shared/data/blog';

	import { translations } from '../translation';

	export let posts: LocalizedPost[];
	export let externalPost: LocalizedExternalPost | undefined;

	const { routes } = getNavigationContext();

	const langStore = getLangContext();
	$: lang = $langStore;

	$: t = translations[lang].posts;
</script>

<section class="max-w-pad mt-[80px] tb:mt-[120px]">
	<ConsecutiveFadeUpIntro selector=":is(.arrow, .char)">
		<a href={$routes.blog.path} title={t.title} class="section-title-container">
			<h2 class=" c-text-h2 uppercase">
				<SplitText text={t.title} />
			</h2>
			<AnimatedArrowCircle class="arrow h-12 w-12 tb:h-16 tb:w-16" handle="parent" />
		</a>
	</ConsecutiveFadeUpIntro>
	<p class="section-desc mt-6" use:intersect>{@html t.description}</p>

	<div class="mt-10 flex gap-10 upto-tb:flex-col tb:mt-[60px] tb:gap-[60px]">
		<div class="flex-1">
			{#if posts[0]}
				<div use:intersect>
					<BlogPostItem post={posts[0]} alwaysVertical />
				</div>
			{/if}
		</div>
		<div class="flex-1 space-y-10">
			{#each posts.slice(1) as post}
				<div use:intersect class="before:mb-10 before:separator tb:first-of-type:before:hidden">
					<BlogPostItem {post} />
				</div>
			{/each}
			{#if externalPost}
				<div use:intersect class="before:mb-10 before:separator">
					<ExternalBlogPostItem post={externalPost} />
				</div>
			{/if}
		</div>
	</div>
</section>
