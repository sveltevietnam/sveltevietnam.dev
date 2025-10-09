<script lang="ts">
	import { SOCIAL_LINKS } from '../../constants.js';

	import type { SocialLinksProps } from '.';

	let { position, class: cls, ...rest }: SocialLinksProps = $props();

	const commonLinkClasses = 'c-link-icon p-2.5 flex border-onehalf rounded-full border-current';
</script>

<ul class={['@lg:gap-2 @max-md:max-w-72 flex flex-wrap items-center gap-3', cls]} {...rest}>
	<li>
		<a
			class={commonLinkClasses}
			href={SOCIAL_LINKS.DISCORD}
			data-external
			data-umami-event="click-social-link"
			data-umami-event-source="discord"
			data-umami-event-position={position}
		>
			<span class="sr-only">Discord</span>
			<i class="i i-[simple-icons--discord] h-5 w-5"></i>
		</a>
	</li>
	<li>
		<a
			class={commonLinkClasses}
			href={SOCIAL_LINKS.BLUESKY}
			data-external
			data-umami-event="click-social-link"
			data-umami-event-source="bluesky"
			data-umami-event-position={position}
		>
			<span class="sr-only">Bluesky</span>
			<i class="i i-[simple-icons--bluesky] h-5 w-5"></i>
		</a>
	</li>
	<li>
		<a
			class={commonLinkClasses}
			href={SOCIAL_LINKS.GITHUB}
			data-external
			data-umami-event="click-social-link"
			data-umami-event-source="github"
			data-umami-event-position={position}
		>
			<span class="sr-only">Github</span>
			<i class="i i-[simple-icons--github] h-5 w-5"></i>
		</a>
	</li>
	<li>
		<a
			class={commonLinkClasses}
			href={SOCIAL_LINKS.OPEN_COLLECTIVE}
			data-external
			data-umami-event="click-social-link"
			data-umami-event-source="opencollective"
			data-umami-event-position={position}
		>
			<span class="sr-only">Open Collective</span>
			<i class="i i-[simple-icons--opencollective] h-5 w-5"></i>
		</a>
	</li>
	<li>
		<a
			class={commonLinkClasses}
			href={SOCIAL_LINKS.YOUTUBE}
			data-external
			data-umami-event="click-social-link"
			data-umami-event-source="youtube"
			data-umami-event-position={position}
		>
			<span class="sr-only">Youtube</span>
			<i class="i i-[simple-icons--youtube] h-5 w-5"></i>
		</a>
	</li>
	<li>
		<a
			class={commonLinkClasses}
			href={SOCIAL_LINKS.FACEBOOK}
			data-external
			data-umami-event="click-social-link"
			data-umami-event-source="facebook"
			data-umami-event-position={position}
		>
			<span class="sr-only">Facebook</span>
			<i class="i i-[simple-icons--facebook] h-5 w-5"></i>
		</a>
	</li>
	<li>
		<a
			class={commonLinkClasses}
			href={SOCIAL_LINKS.THREADS}
			data-external
			data-umami-event="click-social-link"
			data-umami-event-source="threads"
			data-umami-event-position={position}
		>
			<span class="sr-only">Threads</span>
			<i class="i i-[simple-icons--threads] h-5 w-5"></i>
		</a>
	</li>
	<li>
		<a
			class={commonLinkClasses}
			href={SOCIAL_LINKS.LINKEDIN}
			data-external
			data-umami-event="click-social-link"
			data-umami-event-source="linkedin"
			data-umami-event-position={position}
		>
			<span class="sr-only">Linkedin</span>
			<i class="i i-[simple-icons--linkedin] h-5 w-5"></i>
		</a>
	</li>
</ul>
