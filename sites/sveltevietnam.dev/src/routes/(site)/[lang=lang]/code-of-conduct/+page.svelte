<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import * as m from '$data/locales/generated/messages';
	import { EMAILS } from '$data/emails';
	import { SOCIAL_LINKS } from '$data/links';
	import { Breadcrumbs } from '$lib/components/breadcrumbs';
	let { data } = $props();
</script>
<main>
	<!-- intro -->
	<section class="space-y-section pt-intro-pad-top bg-gradient-primary-intro">
		<div
			class="max-w-pad tablet:flex-row tablet:gap-6 tablet:items-start flex flex-col justify-between"
		>
			<div class="tablet:space-y-8 space-y-6 w-full">
				<Breadcrumbs crumbs={data.routing.breadcrumbs} />
				<div class="space-y-4 w-full">
					<h1 class="c-text-heading-page text-primary-on-surface uppercase flex items-center justify-center">
						<T message={m['pages.coc.heading']} />
					</h1>
				</div>
			</div>
		</div>
		<!-- <IntroSeparator /> -->
		<div class="flex gap-3">
			<div class="bg-primary h-6 w-6"></div>
			<div class="bg-primary h-6 flex-1"></div>
			<div class="bg-primary h-5 w-10 sharp-bottom relative"></div>
			<div class="bg-primary h-6 w-6"></div>
			<div class="bg-primary h-5 w-10 sharp-bottom relative"></div>
			<div class="bg-primary h-6 flex-1"></div>
			<div class="bg-primary h-6 w-6"></div>
		</div>
	</section>

	<div class="">
		<section class="max-w-pad py-[80px] space-y-10">
			<h2 class="sr-only"><T message={m['pages.coc.heading']} /></h2>
			<div class="space-y-4 c-btn c-btn--pop hover:cursor-default hover:transform-none p-10 block">
				<p><T message={m['pages.coc.message']} /></p>
				<ul class="mt-4 max-w-[259px] tablet:min-w-[348px] space-y-6">
					<li>
						<a class="c-btn c-btn--pop" href="{SOCIAL_LINKS.DISCORD}" target="_blank">
							<span><T message={m['pages.coc.contact.discord']} /></span>
							<i class="i i-[ph--arrow-square-out] h-6 w-6"></i>
						</a>
					</li>
					<li>
						<a class="c-btn c-btn--pop" href="mailto:{EMAILS.COC}" target="_blank">
							<span><T message={m['pages.coc.contact.email']} /> {EMAILS.COC}</span>
							<i class="i i-[ph--arrow-square-out] h-6 w-6"></i>
						</a>
					</li>
				</ul>
			</div>
		</section>

		<section class="max-w-pad space-y-10 py-[80px] bg-primary-surface">
			<h2 class="c-text-heading-lg border-b">
				<T message={m['pages.coc.excerpt.heading']} />
			</h2>
			<p class="max-w-readable"><T message={m['pages.coc.excerpt.desc']} /></p>
			<div class="relative max-w-pad space-x-section tablet:pl-[80px] tablet:pr-[48px]">
				<blockquote cite="https://sveltesociety.dev/about">
					<div aria-disabled class="absolute -left-8 tablet:left-[10px] top-0 -translate-y-1/2 flex gap-0.5 ">
						<svg xmlns="http://www.w3.org/2000/svg" class="text-on-surface w-12 h-12" viewBox="0 0 24 24"><path fill="currentColor" d="M9.583 17.321C8.553 16.227 8 15 8 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621c.537-.278 1.24-.375 1.929-.311c1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5a3.87 3.87 0 0 1-2.748-1.179"/></svg>
						<svg xmlns="http://www.w3.org/2000/svg" class="text-placeholder w-12 h-12 -ml-8" viewBox="0 0 24 24"><path fill="currentColor" d="M9.583 17.321C8.553 16.227 8 15 8 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621c.537-.278 1.24-.375 1.929-.311c1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5a3.87 3.87 0 0 1-2.748-1.179"/></svg>
					</div>
					<p class="max-w-screen-md"><T message={m['pages.coc.excerpt.content']} /></p>
					<div
						aria-disabled
						class="bottom-6 -right-8 tablet:right-0 tablet:translate-y-0 -translate-y-1/2 flex w-fit gap-0.5 ml-auto mt-3 absolute desktop:left-[51rem] desktop:ml-0"
					>
					<svg xmlns="http://www.w3.org/2000/svg" class="text-placeholder w-12 h-12" viewBox="0 0 24 24"><path fill="currentColor" d="M14.417 6.679C15.447 7.773 16 9 16 10.989c0 3.5-2.456 6.637-6.03 8.188l-.893-1.378c3.335-1.804 3.987-4.145 4.248-5.621c-.537.278-1.24.375-1.93.311C9.591 12.323 8.17 10.842 8.17 9a3.5 3.5 0 0 1 3.5-3.5c1.073 0 2.1.49 2.748 1.179"/></svg>
					<svg xmlns="http://www.w3.org/2000/svg" class="text-on-surface w-12 h-12 -ml-8" viewBox="0 0 24 24"><path fill="currentColor" d="M14.417 6.679C15.447 7.773 16 9 16 10.989c0 3.5-2.456 6.637-6.03 8.188l-.893-1.378c3.335-1.804 3.987-4.145 4.248-5.621c-.537.278-1.24.375-1.93.311C9.591 12.323 8.17 10.842 8.17 9a3.5 3.5 0 0 1 3.5-3.5c1.073 0 2.1.49 2.748 1.179"/></svg>
					</div>
					<footer class="mt-5 text-on-surface-subtle">
						<cite class="not-italic"><T message={m['pages.coc.excerpt.citation']} /></cite>
					</footer>
				</blockquote>
			</div>
		</section>
	</div>
</main>
<style>
	.sharp-bottom::after {
  content: '';
  position: absolute;
  bottom: -20px; 
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 20px solid #FF6A2F;
}
</style>