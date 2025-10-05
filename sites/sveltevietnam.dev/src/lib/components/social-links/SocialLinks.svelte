<script lang="ts">
	import { SOCIAL_LINKS } from '@sveltevietnam/kit/constants';
	import type { HTMLAttributes } from 'svelte/elements';

	let { class: cls, ...rest }: HTMLAttributes<HTMLElement> = $props();

	const commonLinkClasses = 'c-link-icon p-2.5 flex border-onehalf rounded-full border-current';
</script>

<ul class={['widescreen:gap-2 flex flex-wrap items-center gap-3', cls]} {...rest}>
	<li>
		<a class={commonLinkClasses} href={SOCIAL_LINKS.DISCORD} data-external>
			<span class="sr-only">Discord</span>
			<i class="i i-[simple-icons--discord] h-5 w-5"></i>
		</a>
	</li>
	<li>
		<a class={commonLinkClasses} href={SOCIAL_LINKS.BLUESKY} data-external>
			<span class="sr-only">Bluesky</span>
			<i class="i i-[simple-icons--bluesky] h-5 w-5"></i>
		</a>
	</li>
	<li>
		<a class={commonLinkClasses} href={SOCIAL_LINKS.GITHUB} data-external>
			<span class="sr-only">Github</span>
			<i class="i i-[simple-icons--github] h-5 w-5"></i>
		</a>
	</li>
	<li>
		<a class={commonLinkClasses} href={SOCIAL_LINKS.OPEN_COLLECTIVE} data-external>
			<span class="sr-only">Open Collective</span>
			<i class="i i-[simple-icons--opencollective] h-5 w-5"></i>
		</a>
	</li>
	<li>
		<a class={commonLinkClasses} href={SOCIAL_LINKS.FACEBOOK} data-external>
			<span class="sr-only">Facebook</span>
			<i class="i i-[simple-icons--facebook] h-5 w-5"></i>
		</a>
	</li>
	<li>
		<a class={commonLinkClasses} href={SOCIAL_LINKS.YOUTUBE} data-external>
			<span class="sr-only">Youtube</span>
			<i class="i i-[simple-icons--youtube] h-5 w-5"></i>
		</a>
	</li>
</ul>
