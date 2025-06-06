<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import {
		BlogPostListItem,
		type BlogPostListItemProps,
	} from '$lib/components/blog-post-list-item';

	let {
		posts,
		class: cls,
		flat = false,
		...rest
	}: {
		posts: BlogPostListItemProps['post'][];
		flat?: boolean;
	} & HTMLAttributes<HTMLUListElement> = $props();
</script>

{#if flat}
	<ul
		class={['desktop:grid-cols-[1fr_1px_1fr_1px_1fr] desktop:gap-4 grid grid-cols-1 gap-6', cls]}
		{...rest}
	>
		{#if posts[0]}
			<li class="contents">
				<BlogPostListItem post={posts[0]} />
			</li>
		{/if}
		{#if posts[1]}
			<li class="contents">
				<div class="desktop:w-px bg-outline desktop:h-full h-px w-full"></div>
				<BlogPostListItem post={posts[1]} />
			</li>
		{/if}
		{#if posts[2]}
			<li class="contents">
				<div class="desktop:w-px bg-outline desktop:h-full h-px w-full"></div>
				<BlogPostListItem post={posts[2]} />
			</li>
		{/if}
	</ul>
{:else if posts.length > 3}
	<ul
		class={['widescreen:grid-cols-[60fr_41fr_39fr] widescreen:gap-0 grid grid-cols-1 gap-6', cls]}
		{...rest}
	>
		<li
			class="widescreen:pb-0 widescreen:border-b-0 widescreen:pr-4 widescreen:border-r widescreen:row-span-2 border-b
				pb-6"
		>
			<BlogPostListItem
				post={posts[0]}
				aspect={{ widescreen: 'square' }}
				titleFont={{ widescreen: 'big' }}
			/>
		</li>
		<li
			class="widescreen:pb-4 widescreen:px-4 widescreen:col-start-2 widescreen:row-start-1 widescreen:border-r border-b pb-6"
		>
			<BlogPostListItem
				post={posts[1]}
				orientation={{ tablet: 'landscape', widescreen: 'portrait' }}
				aspect={{ tablet: 'square', widescreen: 'video' }}
			/>
		</li>
		<li
			class="widescreen:pb-4 widescreen:pl-4 widescreen:col-start-3 widescreen:row-start-1 border-b pb-6"
		>
			<BlogPostListItem
				post={posts[2]}
				orientation={{ tablet: 'landscape', widescreen: 'portrait' }}
				aspect={{ tablet: 'square', widescreen: 'video' }}
			/>
		</li>
		<li
			class="widescreen:pl-4 widescreen:pt-4 widescreen:col-start-2 widescreen:row-start-2 widescreen:col-span-2"
		>
			<BlogPostListItem
				post={posts[3]}
				orientation={{ tablet: 'landscape' }}
				aspect={{ tablet: 'square' }}
			/>
		</li>
	</ul>
{:else if posts.length === 3}
	<ul class={['widescreen:grid-cols-2 widescreen:gap-0 grid grid-cols-1 gap-6', cls]} {...rest}>
		{#if posts[0]}
			<li
				class="widescreen:pb-0 widescreen:border-b-0 widescreen:pr-4 widescreen:border-r widescreen:row-span-2 border-b
					pb-6"
			>
				<BlogPostListItem post={posts[0]} titleFont={{ widescreen: 'big' }} />
			</li>
		{/if}
		{#if posts[1]}
			<li
				class="widescreen:pb-4 widescreen:pl-4 widescreen:col-start-2 widescreen:row-start-1 border-b pb-6"
			>
				<BlogPostListItem
					post={posts[1]}
					orientation={{ tablet: 'landscape' }}
					aspect={{ tablet: 'square' }}
				/>
			</li>
		{/if}
		{#if posts[2]}
			<li class="widescreen:pl-4 widescreen:pt-4 widescreen:col-start-2 widescreen:row-start-2">
				<BlogPostListItem
					post={posts[2]}
					orientation={{ tablet: 'landscape' }}
					aspect={{ tablet: 'square' }}
				/>
			</li>
		{/if}
	</ul>
{:else if posts.length === 2}
	<ul class="grid grid-cols-1 gap-6 desktop:grid-cols-[1fr_1px_1fr]">
		<li class="contents">
			<BlogPostListItem post={posts[0]} />
		</li>
		<li class="contents">
			<div class="desktop:w-px bg-outline desktop:h-full h-px w-full"></div>
			<BlogPostListItem post={posts[1]} />
		</li>
	</ul>
{:else}
	<div class="_first">
		<BlogPostListItem
			post={posts[0]}
			orientation={{ desktop: 'landscape' }}
			titleFont={{ tablet: 'big' }}
		/>
	</div>
{/if}

<style lang="postcss">
	@import '@sveltevietnam/css/medias';

	._first {
		:global {
			& article {
				justify-content: space-between;

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
