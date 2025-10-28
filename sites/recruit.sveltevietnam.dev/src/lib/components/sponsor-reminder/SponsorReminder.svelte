<script lang="ts" module>
	import { T } from '@sveltevietnam/i18n-new';
	import type { HTMLAttributes } from 'svelte/elements';

	export type SponsorReminderProps = HTMLAttributes<HTMLElement>;
</script>

<script lang="ts">
	let { class: cls, ...rest }: SponsorReminderProps = $props();
</script>

<section class={['space-y-6', cls]} {...rest}>
	<div class=" border-outline flex items-end justify-between border-b">
		<h2 class="c-text-heading">
			<T key="components.sponsor_reminder.heading" />
		</h2>
		<a
			class="c-btn float-end inline-block"
			href="https://opencollective.com/sveltevietnam"
			data-umami-event="click-sponsor"
		>
			<T key="components.sponsor_reminder.cta" />
		</a>
	</div>
	<p class="leading-relaxed">
		<T key="components.sponsor_reminder.desc" />
	</p>
	<p class="c-callout c-callout--info c-callout--icon-bulb leading-relaxed">
		<T key="components.sponsor_reminder.callout" />
	</p>
</section>
