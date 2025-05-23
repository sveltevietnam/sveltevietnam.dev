<script lang="ts">
	import { Toc } from '@svelte-put/toc';
	import { T } from '@sveltevietnam/i18n';

	import * as m from '$data/locales/generated/messages';
	import { Breadcrumbs } from '$lib/components/breadcrumbs';
	import { IntroSeparator } from '$lib/components/intro-separator';
	import { TableOfContents } from '$lib/components/table-of-contents';
	import { RoutingContext } from '$lib/routing/context.svelte';

	import imgIntro from './_page/images/plant.svg?url';

	let { data } = $props();

	const routing = RoutingContext.get();

	const toc = new Toc({
		selector: ':where(h2, h3, h4, h5, h6)',
		observe: {
			enabled: true,
			link: {
				activeAttribute: 'data-current',
			},
		},
	});
</script>

<main>
	<!-- intro -->
	<section class="space-y-section pt-intro-pad-top bg-gradient-primary-intro">
		<div
			class="max-w-pad tablet:flex-row tablet:gap-6 tablet:items-start flex flex-col justify-between"
		>
			<div class="tablet:space-y-8 space-y-6">
				<Breadcrumbs crumbs={routing.breadcrumbs} />
				<div class="space-y-4">
					<h1 class="c-text-heading-page text-primary-on-surface">
						<T message={m['pages.blog_write.heading']} />
					</h1>
					<p class="c-text-subtitle-page max-w-readable">
						<T message={m['pages.blog_write.desc']} />
					</p>
				</div>
			</div>
			<img
				class="max-tablet:self-end tablet:w-64 w-50 h-auto"
				src={imgIntro}
				width="320"
				height="320"
				alt="a human holding hand with an anthropomorphized planet earth"
				fetchpriority="high"
				loading="eager"
				decoding="sync"
			/>
		</div>
		<IntroSeparator variant="pen" />
	</section>

	<div
		class="max-w-pad py-section relative flex flex-col lg:flex-row-reverse
		lg:justify-between lg:gap-20"
	>
		<!-- table of contents -->
		<div class="lg:basis-80 lg:py-10 2xl:basis-96" id="toc">
			<section
				class="top-header mobile:border-onehalf mobile:border-dashed mobile:border-tertiary mobile:-mx-3 mobile:p-3 space-y-6 lg:sticky"
			>
				<h2 class="c-text-heading lg:border-b"><T message={m['pages.blog_write.toc']} /></h2>
				<TableOfContents {toc} />
			</section>
			<hr class="mt-10 lg:hidden" />
		</div>

		<!-- content -->
		<section class="prose max-w-readable-relaxed flex-1">
			{#if data.content}
				{#key data.content}
					<div use:toc.actions.root>
						<data.content />
					</div>
				{/key}
			{/if}
		</section>
	</div>
</main>
