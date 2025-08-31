<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { Breadcrumbs } from '@sveltevietnam/kit/components';

	import { EMAILS } from '$data/emails';
	import { SOCIAL_LINKS } from '$data/links';
	import * as m from '$data/locales/generated/messages';
	import { IntroSeparator } from '$lib/components/intro-separator';
	import * as pagefind from '$lib/pagefind/attributes';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<main {...pagefind.page()}>
	<!-- intro -->
	<section class="space-y-section pt-intro-pad-top bg-gradient-primary-intro">
		<div class="max-w-pad tablet:space-y-8 w-full space-y-6">
				<Breadcrumbs
					crumbs={data.routing.breadcrumbs}
					i18n={{
						aria: m['components.breadcrumbs.aria'],
						home: m['components.breadcrumbs.home'],
					}}
				/>
			<h1
				class="c-text-heading-page text-primary-on-surface flex items-center justify-center uppercase"
			>
				<T message={m['pages.coc.heading']} />
			</h1>
		</div>
		<IntroSeparator variant="flag" />
	</section>

	<section class="max-w-pad py-section">
		<h2 class="sr-only" id="description"><T message={m['pages.coc.heading']} /></h2>
		<div
			class="tablet:p-8 desktop:p-10 shadow-brutal-lg border-onehalf w-fit space-y-6 border-current p-6"
		>
			<p class="max-w-readable-relaxed leading-relaxed"><T message={m['pages.coc.message']} /></p>
			<ul class="w-fit space-y-6">
				<li>
					<a
						class="c-btn c-btn--pop flex items-center justify-between"
						href={SOCIAL_LINKS.DISCORD}
						data-external
					>
						<span><T message={m['pages.coc.contact.discord']} /></span>
						<i class="i i-[ph--arrow-square-out] h-6 w-6"></i>
					</a>
				</li>
				<li>
					<a
						class="c-btn c-btn--pop flex items-center justify-between"
						href="mailto:{EMAILS.COC}"
						data-external
					>
						<span><T message={m['pages.coc.contact.email']} /> {EMAILS.COC}</span>
						<i class="i i-[ph--arrow-square-out] h-6 w-6"></i>
					</a>
				</li>
			</ul>
		</div>
	</section>

	<section class="max-w-pad bg-primary-surface py-section space-y-6">
		<h2 class="c-text-heading-lg border-b" id="excerpt">
			<T message={m['pages.coc.excerpt.heading']} />
		</h2>
		<p class="max-w-readable-relaxed leading-relaxed">
			<T message={m['pages.coc.excerpt.desc']} />
		</p>
		<blockquote class="tablet:px-10 desktop:px-12 px-6" cite="https://sveltesociety.dev/about">
			<p class="max-w-readable-relaxed relative leading-relaxed">
				{@render quotes('absolute right-full -top-3 -translate-x-1.5')}
				<T message={m['pages.coc.excerpt.content']} />
				{@render quotes('absolute -scale-100 left-full -bottom-3')}
			</p>
			<footer class="text-on-surface-subtle mt-5">
				<cite class="not-italic"><T message={m['pages.coc.excerpt.citation']} /></cite>
			</footer>
		</blockquote>
	</section>
</main>

{#snippet quotes(cls: string)}
	<i class={['flex gap-0.5', cls]}>
		<span class="quote bg-on-surface shrink-0"></span>
		<span class="quote bg-placeholder shrink-0"></span>
	</i>
{/snippet}

<style>
	.quote {
		width: calc(var(--spacing) * 4);
		height: calc(var(--spacing) * 7.5);

		mask-image: url('./_page/images/quote.svg');
		mask-repeat: no-repeat;
		mask-size: 100% 100%;
	}

	main + :global(#edit-this-page) {
		background-color: var(--color-primary-surface);
	}
</style>
