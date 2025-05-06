<script lang="ts">
	import { Toc } from '@svelte-put/toc';
	import { T } from '@sveltevietnam/i18n';

	import * as m from '$data/locales/generated/messages';
	// import * as p from '$data/routes/generated';
	import { Breadcrumbs } from '$lib/components/breadcrumbs';
	import { IntroSeparator } from '$lib/components/intro-separator';
	import { RoutingContext } from '$lib/routing/context.svelte';
	// import { SettingsContext } from '$lib/settings/context.svelte';

	import imgIntro from './_page/images/plant.svg?url';

	let { data } = $props();

	const routing = RoutingContext.get();
	// const settings = SettingsContext.get();

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
		<div class="lg:basis-80 lg:py-10" id="toc">
			<section class="top-header space-y-6 lg:sticky">
				<h2 class="c-text-heading lg:border-b"><T message={m['pages.blog_write.toc']} /></h2>
				<ul class="space-y-1">
					{#each toc.items.values() as tocItem (tocItem.id)}
						{@const level = tocItem.element.tagName.slice(1)}
						<li>
							<!-- svelte-ignore a11y_missing_attribute -->
							<a
								use:toc.actions.link={tocItem}
								class="c-link-lazy current:text-link block py-1 capitalize"
								style:padding-left="calc(({level} - 2) * 1ch)"
							>
								<!-- textContent injected by toc -->
							</a>
						</li>
					{/each}
				</ul>
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
