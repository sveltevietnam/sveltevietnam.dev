<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import { TBA } from '$lib/components/tba';
	import { SettingsContext } from '$lib/settings/context.svelte';

	const settings = SettingsContext.get();
</script>

<section class="max-w-pad pt-section pb-section-more bg-gradient-primary space-y-10">
	<div class="space-y-6 text-center">
		<h2 class="c-text-heading-lg"><T message={m['pages.home.events.heading']} /></h2>
		<p class="mx-auto max-w-readable"><T message={m['pages.home.events.desc']} /></p>
	</div>
	<TBA class="text-center mx-auto w-fit">
		<p class="c-text-title-sm"><T message={m['pages.home.events.tba.desc']} /></p>
		<p>
			<a class="c-link" href="{p['/:lang/events']({ lang: settings.language })}#participate">
				<T message={m['pages.home.events.tba.subscribe']} />
			</a>
			<br/>
			<T message={m['or']} />
			<br/>
			<a class="c-link" href="{p['/:lang/events']({ lang: settings.language })}#past">
				<T message={m['pages.home.events.tba.view_past']} />
			</a>
		</p>
	</TBA>
</section>
