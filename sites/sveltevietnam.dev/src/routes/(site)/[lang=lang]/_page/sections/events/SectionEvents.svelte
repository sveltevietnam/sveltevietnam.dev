<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { TBA } from '@sveltevietnam/kit/components';
	import { Contexts } from '@sveltevietnam/kit/contexts';

	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';

	const { routing } = Contexts.get();
</script>

<section
	class="max-w-pad pt-section pb-section-more bg-gradient-primary space-y-10"
	data-pagefind-ignore
>
	<div class="space-y-6 text-center">
		<h2 class="c-text-heading-lg" id="events"><T message={m['pages.home.events.heading']} /></h2>
		<p class="max-w-readable mx-auto"><T message={m['pages.home.events.desc']} /></p>
	</div>
	<TBA class="mx-auto w-fit text-center">
		<p class="c-text-title-sm"><T message={m['pages.home.events.tba.desc']} /></p>
		<p>
			<a class="c-link" href="{p['/:lang/events']({ lang: routing.lang })}#participate">
				<T message={m['pages.home.events.tba.subscribe']} />
			</a>
			<br />
			<T message={m['or']} />
			<br />
			<a class="c-link" href="{p['/:lang/events']({ lang: routing.lang })}#past">
				<T message={m['pages.home.events.tba.view_past']} />
			</a>
		</p>
	</TBA>
</section>
