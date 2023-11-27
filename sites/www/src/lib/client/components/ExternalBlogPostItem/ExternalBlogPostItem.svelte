<script lang="ts">
	import type { LocalizedExternalPost } from '$shared/data/blog';

	export let post: LocalizedExternalPost;
	let cls = '';
	export { cls as class };

	const titleClass = 'tp-h4 font-bold c-link c-link--preserved';
</script>

<article class="space-y-3 {cls}">
	<a href={post.href} class="block w-fit" external>
		<svg inline-src="icon/external-link" class="mb-2 mr-2 inline-block" />
		<slot name="title" class={titleClass} text={post.title}>
			<span class={titleClass}>{post.title}</span>
		</slot>
	</a>
	<p>{post.description}</p>
	<p class="font-medium">{post.author}</p>
</article>
