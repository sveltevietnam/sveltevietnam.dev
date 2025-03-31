<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import {
		BlogPostListItem,
		type BlogPostListItemProps,
	} from '$lib/components/blog-post-list-item';
	import { BlogPostShowcase } from '$lib/components/blog-post-showcase';

	let {
		posts,
		class: cls,
		flat = false,
		...rest
	}: HTMLAttributes<HTMLUListElement> & {
		posts: BlogPostListItemProps['post'][];
		flat?: boolean;
	} = $props();
</script>

{#if posts.length > 1 && posts.length < 4}
	<BlogPostShowcase {posts} class={cls} {...rest}></BlogPostShowcase>
{:else}
	<ul class={['widescreen:grid-cols-3 widescreen:gap-10 grid grid-cols-1 gap-8', cls]} {...rest}>
		{#if !flat}
			<li class="contents">
				<div class="_first col-span-full">
					<BlogPostListItem
						post={posts[0]}
						orientation={{ tablet: 'portrait', widescreen: 'landscape' }}
						titleFont={{ tablet: 'big' }}
					/>
				</div>
				<div class="bg-outline col-span-full h-px w-full"></div>
			</li>
		{/if}
		{#each flat ? posts : posts.slice(1) as post, i (post.slug)}
			<li class="contents">
				<BlogPostListItem
					{post}
					orientation={{ tablet: 'landscape', widescreen: 'portrait' }}
					aspect={{ tablet: 'square', widescreen: 'video' }}
				/>
				{#if i < 8}
					<div class="widescreen:hidden bg-outline col-span-full h-px w-full"></div>
				{/if}
			</li>
		{/each}
	</ul>
{/if}

<style lang="postcss">
	@import '@sveltevietnam/css/medias';

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
