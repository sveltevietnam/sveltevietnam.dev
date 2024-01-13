<script lang="ts">
	import { getLangContext } from '$client/contexts/lang';
	import { getNavigationContext } from '$client/contexts/navigation';
	import { formateDateForBlog } from '$lib/utils/datetime';
	import fallbackThumbnail from '$shared/assets/images/fallback/16x9.jpg?w=1000&enhanced&imagetools';
	import type { LocalizedPost } from '$shared/data/blog';

	export let alwaysVertical = false;
	export let hideSeries = false;
	export let post: LocalizedPost;
	let cls = '';
	export { cls as class };

	const { routes } = getNavigationContext();
	const langStore = getLangContext();
	$: lang = $langStore;

	$: href = `${$routes.blog.path}/${post.slug}`;

	const titleClass = 'c-text-h4 font-bold c-link c-link--preserved';
</script>

<article class={cls} class:always-vertical={alwaysVertical}>
	<a {href} class="__thumbnail c-link c-link--image">
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
	<div class="__title">
		{#if post.series}
			<p class="c-text-cap1 mb-1 text-green-900 dark:text-green-300" class:hidden={hideSeries}>
				— {post.series.map((s) => s.title).join(', ')}
			</p>
		{/if}
		<a {href} class="__title block w-fit">
			<slot name="title" class={titleClass} text={post.title}>
				<span class={titleClass}>{post.title}</span>
			</slot>
		</a>
	</div>
	<ul class="__tags flex flex-wrap items-center gap-2">
		{#each post?.tags ?? [] as tag}
			<li class="c-tag">{tag}</li>
		{/each}
	</ul>
	<p class="__description">{post.description}</p>
	<div class="__author-and-date flex items-center justify-between">
		<p class="font-medium">{post.authors.map((a) => a.name).join(', ')}</p>
		<time class="text-fg-200">{formateDateForBlog(lang, post.date)}</time>
	</div>
</article>

<style lang="postcss">
	article {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: repeat(5, auto);
		row-gap: 16px;

		@screen tb {
			&:not(.always-vertical) {
				grid-template-columns: auto 1fr;
				grid-template-rows: repeat(4, auto);
				row-gap: 12px;
				column-gap: 24px;
			}
		}
	}

	:global(.blog-subgrid-list) {
		display: grid;
		grid-template-columns: 1fr;
		row-gap: 40px;

		@screen upto-tb {
			& > :global(li) {
				&::before {
					content: '';

					display: block;

					width: 100%;
					height: 1px;
					margin-bottom: 40px;

					background: theme('colors.outline.DEFAULT');
				}
			}

			&:first-of-type > :global(li):first-of-type::before {
				display: none;
			}
		}

		@screen tb {
			grid-template-columns: repeat(3, 1fr);
			grid-template-rows: repeat(5, auto);
			row-gap: 0;
			column-gap: 40px;

			& > :global(li) {
				display: grid;
				grid-row: 1 / 6;
				grid-template-columns: subgrid;
				grid-template-rows: subgrid;
			}

			& article.always-vertical {
				grid-row: 1 / 6;
				grid-template-rows: subgrid;
			}
		}
	}

	.__thumbnail {
		grid-row: 1 / 2;
		margin-bottom: 8px;

		@screen tb {
			article:not(.always-vertical) & {
				grid-column: 1 / 2;
				grid-row: 1 / 5;
				padding-bottom: 0;
			}
		}
	}

	.__title {
		grid-row: 2 / 3;

		@screen tb {
			article:not(.always-vertical) & {
				grid-column: 2 / 3;
				grid-row: 1 / 2;
			}
		}
	}

	.__tags {
		grid-row: 3 / 4;
		align-self: flex-start;

		@screen tb {
			article:not(.always-vertical) & {
				grid-column: 2 / 3;
				grid-row: 2 / 3;
			}
		}
	}

	.__description {
		grid-row: 4 / 5;

		@screen tb {
			article:not(.always-vertical) & {
				grid-column: 2 / 3;
				grid-row: 3 / 4;
			}
		}
	}

	.__author-and-date {
		grid-row: 5 / 6;

		@screen tb {
			article:not(.always-vertical) & {
				grid-column: 2 / 3;
				grid-row: 4 / 5;
			}
		}
	}
</style>
