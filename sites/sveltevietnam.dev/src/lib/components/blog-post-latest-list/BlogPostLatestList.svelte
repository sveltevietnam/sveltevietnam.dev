<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import {
		BlogPostListItem,
		type BlogPostListItemProps,
	} from '$lib/components/blog-post-list-item';

	let {
		posts,
		class: cls,
		...rest
	}: {
		posts: [
			BlogPostListItemProps['post'],
			BlogPostListItemProps['post'],
			BlogPostListItemProps['post'],
		];
	} & HTMLAttributes<HTMLUListElement> = $props();
</script>

<ul class={['widescreen:grid-cols-2 widescreen:gap-0 grid grid-cols-1 gap-6', cls]} {...rest}>
	<li
		class="widescreen:pb-0 widescreen:border-b-0 widescreen:pr-4 widescreen:border-r widescreen:row-span-2 border-b
		pb-6"
	>
		<BlogPostListItem post={posts[0]} />
	</li>
	<li
		class="widescreen:pb-4 widescreen:pl-4 widescreen:col-start-2 widescreen:row-start-1 border-b pb-6"
	>
		<BlogPostListItem
			post={posts[1]}
			orientation={{ tablet: 'landscape' }}
			aspect={{ tablet: 'square' }}
		/>
	</li>
	<li class="widescreen:pl-4 widescreen:pt-4 widescreen:col-start-2 widescreen:row-start-2">
		<BlogPostListItem
			post={posts[2]}
			orientation={{ tablet: 'landscape' }}
			aspect={{ tablet: 'square' }}
		/>
	</li>
</ul>
