<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { RoutingContext } from '@sveltevietnam/kit/contexts';

	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import { AuthPageLayout } from '$lib/components/auth-page-layout';

	import svgKeyVisual from './_local/images/key-visual.svg';

	const routing = RoutingContext.get();
</script>

<AuthPageLayout class="max-w-readable">
	<div class="tablet:-mx-10">
		<div class="tablet:px-10 space-y-6">
			<h1 class="c-text-heading-md">
				<T message={m['pages.welcome.heading']} />
			</h1>
			<p>
				<T message={m['pages.welcome.desc']} />
			</p>
			<div class="pt-2">
				<a
					class="c-btn c-btn--pop block w-fit"
					href={p['/:lang/postings/create']({ lang: routing.lang })}
				>
					<T message={m['pages.welcome.cta']} />
				</a>
			</div>
		</div>

		<img class="h-auto w-full" width="726" height="278" alt="" src={svgKeyVisual} />

		<p class="tablet:px-10 mt-10">
			<T message={m['pages.welcome.feedback']} />
		</p>
	</div>
</AuthPageLayout>
