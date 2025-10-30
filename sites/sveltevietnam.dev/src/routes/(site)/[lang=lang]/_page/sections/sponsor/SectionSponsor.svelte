<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { TBA } from '@sveltevietnam/kit/components';
	import { Contexts } from '@sveltevietnam/kit/contexts';

	import * as p from '$data/routes/generated';

	const { routing } = Contexts.get();
</script>

<section
	class="max-w-pad pt-section pb-section-more bg-gradient-primary space-y-10"
	data-pagefind-ignore
>
	<div class="space-y-6 text-center">
		<h2 class="c-text-heading-lg" id="sponsor"><T key="pages.home.sponsor.heading" /></h2>
		<p class="max-w-readable mx-auto"><T key="pages.home.sponsor.desc" /></p>
	</div>
	<TBA class="mx-auto w-fit text-center">
		<p><T key="pages.home.sponsor.list" /></p>
		<p>
			<a class="c-link" href={p['/:lang/sponsor']({ lang: routing.lang })}>
				<T key="pages.home.sponsor.read_more" />
			</a>
		</p>
	</TBA>
</section>
