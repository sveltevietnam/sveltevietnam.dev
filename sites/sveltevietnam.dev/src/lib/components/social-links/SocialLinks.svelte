<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import { SOCIAL_LINKS } from '$data/links';

	let { class: cls, ...rest }: HTMLAttributes<HTMLElement> = $props();

	const commonLinkClasses = 'c-link-icon p-2 flex border rounded-full border-current';
</script>

<ul class={['flex flex-wrap items-center justify-center gap-2', cls]} {...rest}>
	<li>
		<a class={commonLinkClasses} href={SOCIAL_LINKS.DISCORD} data-external>
			<svg class="h-6 w-6" inline-src="simpleicons/discord"></svg>
			<span class="sr-only">Discord</span>
		</a>
	</li>
	<li>
		<a class={commonLinkClasses} href={SOCIAL_LINKS.BLUESKY} data-external>
			<svg class="h-6 w-6" inline-src="simpleicons/bluesky"></svg>
			<span class="sr-only">Bluesky</span>
		</a>
	</li>
	<li>
		<a class={commonLinkClasses} href={SOCIAL_LINKS.GITHUB} data-external>
			<svg class="h-6 w-6" inline-src="simpleicons/github"></svg>
			<span class="sr-only">Github</span>
		</a>
	</li>
	<li>
		<a class={commonLinkClasses} href={SOCIAL_LINKS.OPEN_COLLECTIVE} data-external>
			<svg class="h-6 w-6" inline-src="simpleicons/opencollective"></svg>
			<span class="sr-only">Open Collective</span>
		</a>
	</li>
	<li>
		<a class={commonLinkClasses} href={SOCIAL_LINKS.FACEBOOK} data-external>
			<svg class="h-6 w-6" inline-src="simpleicons/facebook"></svg>
			<span class="sr-only">Facebook</span>
		</a>
	</li>
	<li>
		<a class={commonLinkClasses} href={SOCIAL_LINKS.YOUTUBE} data-external>
			<svg class="h-6 w-6" inline-src="simpleicons/youtube"></svg>
			<span class="sr-only">Youtube</span>
		</a>
	</li>
</ul>
