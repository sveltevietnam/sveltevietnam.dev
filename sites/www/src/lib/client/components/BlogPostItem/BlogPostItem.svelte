<script lang="ts">
	import { getLangContext } from '$client/contexts/lang';
	import fallbackThumbnail from '$shared/assets/images/fallback/default.jpg?w=1000&enhanced&imagetools';
	import type { LocalizedPost } from '$shared/data/blog';
	import { BLOG_PATH } from '$shared/services/navigation';
	import { formateDateForBlog } from '$shared/utils/datetime';

	export let alwaysVertical = false;
	export let post: LocalizedPost;
	let cls = '';
	export { cls as class };

	const langStore = getLangContext();
	$: lang = $langStore;

	$: href = `${BLOG_PATH}/${post.slug}`;

	const titleClass = 'c-text-h4 font-bold c-link c-link--preserved';
</script>

<article class={cls} class:always-vertical={alwaysVertical}>
	<div>
		<a {href} class="c-link c-link--image">
			{#if post.thumbnail}
				<enhanced:img
					src={post.thumbnail}
					alt={post.title}
					class={!alwaysVertical ? 'tb:w-[200px]' : ''}
				/>
			{:else}
				<enhanced:img
					src={fallbackThumbnail}
					alt={post.title}
					class={!alwaysVertical ? 'tb:w-[200px]' : ''}
				/>
			{/if}
		</a>
	</div>
	<div class="content">
		<a {href} class="block w-fit">
			<slot name="title" class={titleClass} text={post.title}>
				<span class={titleClass}>{post.title}</span>
			</slot>
		</a>
		<ul class="flex flex-wrap items-center gap-2">
			{#each post?.tags ?? [] as tag}
				<li class="c-tag">{tag}</li>
			{/each}
		</ul>
		<p>{post.description}</p>
		<div class="flex items-center justify-between">
			<p class="font-medium">{post.authors.map((a) => a.name).join(', ')}</p>
			<time class="text-fg-200">{formateDateForBlog(lang, post.date)}</time>
		</div>
	</div>
</article>

<style lang="postcss">
	article {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto 1fr;
		gap: 32px;

		@screen tb {
			&:not(.always-vertical) {
				grid-template-columns: auto 1fr;
				grid-template-rows: 1fr;
				gap: 24px;
			}
		}
	}

	.fallback-thumbnail {
		width: 100%;
		height: 200px;

		@screen tb {
			article.always-vertical & {
				height: 300px;
			}

			article:not(.always-vertical) & {
				width: 200px;
			}
		}
	}

	.content {
		@space-y 16px;

		@screen tb {
			article:not(.always-vertical) & {
				@space-y 12px;
			}
		}
	}
</style>
