<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { EMAILS } from '@sveltevietnam/kit/constants';
	import { Contexts } from '@sveltevietnam/kit/contexts';

	import * as p from '$data/routes/generated';
	import { SingleBoxPageLayout } from '$lib/components/single-box-page-layout';

	import svgKeyVisual from './_local/images/key-visual.svg';

	const { routing } = Contexts.get();
</script>

<SingleBoxPageLayout class="max-w-readable">
	<div class="tablet:-mx-10">
		<div class="tablet:px-10 space-y-6">
			<h1 class="c-text-heading-md">
				<T key="pages.welcome.heading" />
			</h1>
			<p>
				<T key="pages.welcome.desc" />
			</p>
			<div class="pt-2">
				<a
					class="c-btn c-btn--pop block w-fit"
					href={p['/:lang/postings/create']({ lang: routing.lang })}
				>
					<T key="pages.welcome.cta" />
				</a>
			</div>
		</div>

		<img class="h-auto w-full" width="726" height="278" alt="" src={svgKeyVisual} />

		<p class="tablet:px-10 mt-10">
			<T key="pages.welcome.feedback" params={{ mail: EMAILS.JOBS }} />
		</p>
	</div>
</SingleBoxPageLayout>
