<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import { BlogPostListItem, type BlogPostListItemProps } from '$lib/components/blog-post-list-item';

	let { posts, class: cls, ...rest }: { posts: BlogPostListItemProps['post'][] } & HTMLAttributes<HTMLUListElement> = $props();
</script>

<ul class={['grid grid-cols-1 widescreen:grid-cols-3 gap-8 widescreen:gap-10', cls]} {...rest}>
	<li class="contents">
		<div class="_first col-span-full">
			<BlogPostListItem
				post={posts[0]}
				orientation={{ tablet: 'portrait', widescreen: 'landscape' }}
				titleFont={{ tablet: 'big' }}
			/>
		</div>
		<div class="w-full h-0.25 bg-outline col-span-full"></div>
	</li>
	{#each posts.slice(1) as post, i}
	<li class="contents">
		<BlogPostListItem
			{post}
			orientation={{ tablet: 'landscape', widescreen: 'portrait' }}
			aspect={{ tablet: 'square', widescreen: 'video' }}
		/>
		{#if i < 8}
			<div class="widescreen:hidden w-full h-0.25 bg-outline col-span-full"></div>
		{/if}
	</li>
	{/each}
</ul>

<style lang="postcss">
	@import '@sveltevietnam/ui/css/medias';

	._first {
		:global {
			& article {
				@media (--widescreen) {
					flex-direction: row-reverse;
				}
			}

			& img {
				@media (--desktop) {
					max-width: calc(108 * var(--spacing));
				}

				@media (--widescreen) {
					max-width: calc(120 * var(--spacing));
				}

				@media (width >= 90rem) {
					max-width: calc(180 * var(--spacing));
				}
			}
		}
	}
</style>
