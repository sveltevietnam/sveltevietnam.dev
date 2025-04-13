<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import type { Message, MessageType } from '@sveltevietnam/i18n/runtime';
	import type { Picture } from 'vite-imagetools';

	import { SOCIAL_LINKS } from '$data/links';
	import * as m from '$data/locales/generated/messages';

	import svgPuzzle from './images/puzzle.svg';
	import screenshotDocs from './images/screenshot-svelte-docs.jpg?enhanced&w=1400;900;600;300&imagetools';
	import screenshotGithub from './images/screenshot-svelte-github.jpg?enhanced&w=1400;900;600;300&imagetools';
	import screenshotHack from './images/screenshot-svelte-hack.jpg?enhanced&w=1400;900;600;300&imagetools';
	import screenshotLab from './images/screenshot-svelte-lab.jpg?enhanced&w=1400;900;600;300&imagetools';
	import screenshotPlayground from './images/screenshot-svelte-playground.jpg?enhanced&w=1400;900;600;300&imagetools';
	import screenshotSociety from './images/screenshot-svelte-society.jpg?enhanced&w=1400;900;600;300&imagetools';
	import screenshotSummit from './images/screenshot-svelte-summit.jpg?enhanced&w=1400;900;600;300&imagetools';
	import screenshotTutorial from './images/screenshot-svelte-tutorial.jpg?enhanced&w=1400;900;600;300&imagetools';

	const sectionClasses = [
		'relative bg-surface p-4 flex flex-col gap-8 max-w-256 mx-auto',
		'tablet:p-10 tablet:gap-15',
		'before:absolute before:-z-1 before:-inset-0.5 before:bg-gradient-to-b before:from-on-surface before:via-svelte before:to-transparent',
	];
</script>

{#snippet step(message: Message<'string', never>)}
	<div class="isolate">
		<p
			class="_border-gradient bg-surface c-text-body-xs relative w-fit px-3 py-1.5 uppercase leading-tight tracking-widest"
		>
			<T {message} />
		</p>
	</div>
	<!-- <p -->
	<!-- 	class="c-text-body-xs relative isolate w-fit overflow-hidden px-3.5 py-2 uppercase leading-tight tracking-widest" -->
	<!-- > -->
	<!-- 	<span -->
	<!-- 		class="inset-0.25 from-primary to-secondary p-0.25 absolute z-0 -->
	<!-- 		block bg-gradient-to-br" -->
	<!-- 	></span> -->
	<!-- 	<span class="z-1 relative bg-surface"><T {message} /></span> -->
	<!-- </p> -->
{/snippet}

{#snippet resource({
	description,
	links,
	linksClasses,
	image,
	footnote,
}: {
	description: Message<MessageType, never>;
	links: { message: Message<MessageType, never>; href: string }[];
	linksClasses?: string;
	image: { message: Message<MessageType, never>; href: string; src: Picture } | { src: string; width: number, height: number };
	footnote?: Message<MessageType, never>;
})}
	<div
		class="tablet:gap-8 desktop:gap-10 mobile:flex-col odd:tablet:flex-row-reverse group flex gap-6"
	>
		<div class="tablet:space-y-6 mobile:contents flex-1">
			<p
				class="mobile:order-1 leading-relaxed first-letter:float-left first-letter:pr-1 first-letter:text-[4em]"
			>
				<T message={description} />
			</p>
			<div class="mobile:order-3 flex flex-col gap-6 {linksClasses}">
				{#each links as { message, href } (href)}
					<a class="c-btn c-btn--pop" {href}>
						<span><T {message} /></span>
						<i class="i i-[ph--arrow-square-out] h-6 w-6"></i>
					</a>
				{/each}
			</div>
			{#if footnote}
				<p class="mobile:order-4">
					<em><T message={footnote} /></em>
				</p>
			{/if}
		</div>
		{#if 'width' in image}
			<div class="tablet:flex-1 mobile:order-2">
				<img class="w-full h-auto" {...image} alt="" loading="lazy" fetchpriority="low" decoding="async" />
			</div>
		{:else}
			<div
				class="from-primary to-tertiary mobile:order-2 tablet:flex-1 h-fit
				bg-gradient-to-r p-0.5 group-odd:bg-gradient-to-l"
			>
				<a class="c-link-image block" href={image.href}>
					<span class="sr-only"><T message={image.message} /></span>
					<enhanced:img
						src={image.src}
						alt=""
						loading="lazy"
						fetchpriority="low"
						decoding="async"
						sizes="(min-width: 48rem) 28.125rem, (min-width: 25rem) 43.75rem, 18.75rem"
					/>
				</a>
			</div>
		{/if}
	</div>
{/snippet}

<section class="max-w-pad pb-section space-y-30">
	<h2 class="c-text-heading-lg text-center"><T message={m['pages.home.resources.heading']} /></h2>

	<section class={[...sectionClasses, 'tablet:max-desktop:pb-32']}>
		<div class="relative flex items-center justify-between gap-4">
			<div class="space-y-4">
				{@render step(m['pages.home.resources.one.step'])}
				<h3 class="c-text-heading-md pr-30"><T message={m['pages.home.resources.one.heading']} /></h3>
			</div>
			<svg
				class="mobile:absolute mobile:-top-2 mobile:-right-2 w-25 h-auto shrink-0"
				inline-src="./images/box"
			></svg>
		</div>

		{@render resource({
			description: m['pages.home.resources.one.tutorial.desc'],
			links: [
				{
					message: m['pages.home.resources.one.tutorial.link'],
					href: 'https://svelte.dev/tutorial',
				},
			],
			linksClasses: 'w-fit',
			image: {
				message: m['pages.home.resources.one.tutorial.link'],
				href: 'https://svelte.dev/tutorial',
				src: screenshotTutorial,
			},
			footnote: m['pages.home.resources.one.tutorial.footnote'],
		})}

		{@render resource({
			description: m['pages.home.resources.one.playground.desc'],
			links: [
				{
					message: m['pages.home.resources.one.playground.link'],
					href: 'https://svelte.dev/playground',
				},
			],
			linksClasses: 'w-fit',
			image: {
				message: m['pages.home.resources.one.playground.link'],
				href: 'https://svelte.dev/playground',
				src: screenshotPlayground,
			},
		})}

		{@render resource({
			description: m['pages.home.resources.one.lab.desc'],
			links: [
				{ message: m['pages.home.resources.one.lab.link'], href: 'https://www.sveltelab.dev/' },
			],
			linksClasses: 'ml-auto w-fit',
			image: {
				message: m['pages.home.resources.one.lab.link'],
				href: 'https://www.sveltelab.dev/',
				src: screenshotLab,
			},
		})}

		<svg
			class="w-39.5 tablet:absolute desktop:left-10 desktop:bottom-10 bottom-2 left-2 h-auto"
			inline-src="./images/rect-washer"
		></svg>
	</section>

	<section class={sectionClasses}>
		<div class="mobile:flex-col relative flex items-center justify-between gap-4">
			<svg class="h-18 mobile:self-start w-auto shrink-0" inline-src="./images/book"></svg>
			<div class="mobile:-mt-10 flex flex-col items-end gap-4">
				{@render step(m['pages.home.resources.two.step'])}
				<h3 class="c-text-heading-md text-right">
					<T message={m['pages.home.resources.two.heading']} />
				</h3>
			</div>
		</div>

		{@render resource({
			description: m['pages.home.resources.two.docs.desc'],
			links: [
				{ message: m['pages.home.resources.two.docs.link'], href: 'https://svelte.dev/docs' },
			],
			linksClasses: 'w-fit',
			image: {
				message: m['pages.home.resources.two.docs.link'],
				href: 'https://svelte.dev/docs',
				src: screenshotDocs,
			},
		})}
	</section>

	<section class={sectionClasses}>
		<div class="space-y-4">
			{@render step(m['pages.home.resources.three.step'])}
			<h3 class="c-text-heading-md text-right">
				<T message={m['pages.home.resources.three.heading']} />
			</h3>
		</div>

		{@render resource({
			description: m['pages.home.resources.three.desc'],
			links: [
				{ message: m['pages.home.resources.three.discord'], href: SOCIAL_LINKS.DISCORD },
				{ message: m['pages.home.resources.bluesky'], href: SOCIAL_LINKS.BLUESKY },
				{ message: m['pages.home.resources.three.github'], href: SOCIAL_LINKS.GITHUB },
			],
			image: { src: svgPuzzle, width: 291, height: 159 },
		})}
		<p class="-mt-4"><T message={m['pages.home.resources.three.note']} /></p>
	</section>

	<section class={sectionClasses}>
		<div class="flex items-start justify-between gap-4">
			<svg class="h-20 w-20 shrink-0" inline-src="./images/svelte-society-logo"></svg>
			<div class="flex flex-col items-end gap-4">
				{@render step(m['pages.home.resources.four.step'])}
				<h3 class="c-text-heading-md text-right">
					<T message={m['pages.home.resources.four.heading']} />
				</h3>
			</div>
		</div>

		{@render resource({
			description: m['pages.home.resources.four.svelte.desc'],
			links: [
				{
					message: m['pages.home.resources.four.svelte.github.svelte'],
					href: 'https://github.com/sveltejs/svelte',
				},
				{
					message: m['pages.home.resources.four.svelte.github.sveltekit'],
					href: 'https://github.com/sveltejs/kit',
				},
				{
					message: m['pages.home.resources.four.svelte.github.svelte_dev'],
					href: 'https://github.com/sveltejs/svelte.dev',
				},
				{ message: m['pages.home.resources.bluesky'], href: 'https://bsky.app/profile/svelte.dev' },
			],
			image: {
				message: m['pages.home.resources.four.svelte.github.svelte'],
				href: 'https://github.com/sveltejs',
				src: screenshotGithub,
			},
		})}

		{@render resource({
			description: m['pages.home.resources.four.society.desc'],
			links: [
				{
					message: m['pages.home.resources.four.society.discord'],
					href: 'https://svelte.dev/chat',
				},
				{
					message: m['pages.home.resources.bluesky'],
					href: 'https://bsky.app/profile/sveltesociety.dev',
				},
				{
					message: m['pages.home.resources.four.society.website'],
					href: 'https://www.sveltesociety.dev/',
				},
			],
			image: {
				message: m['pages.home.resources.four.society.website'],
				href: 'https://www.sveltesociety.dev/',
				src: screenshotSociety,
			},
		})}

		{@render resource({
			description: m['pages.home.resources.four.summit.desc'],
			links: [
				{
					message: m['pages.home.resources.four.summit.youtube'],
					href: 'https://www.youtube.com/@SvelteSociety',
				},
				{
					message: m['pages.home.resources.four.summit.website'],
					href: 'https://www.sveltesummit.com/',
				},
			],
			image: {
				message: m['pages.home.resources.four.summit.website'],
				href: 'https://www.sveltesummit.com/',
				src: screenshotSummit,
			},
		})}

		{@render resource({
			description: m['pages.home.resources.four.hack.desc'],
			links: [
				{
					message: m['pages.home.resources.four.hack.link'],
					href: 'https://hack.sveltesociety.dev',
				},
			],
			image: {
				message: m['pages.home.resources.four.hack.link'],
				href: 'https://hack.sveltesociety.dev',
				src: screenshotHack,
			},
		})}

		<div class="bg-outline h-px w-full"></div>

		<section class="prose max-w-readable-relaxed leading-relaxed">
			<p><T message={m['pages.home.resources.four.others']} /></p>
			<ul>
				<li><T message={m['pages.home.resources.four.newsletter']} /></li>
				<li><T message={m['pages.home.resources.four.madebysvelte']} /></li>
				<li><T message={m['pages.home.resources.four.jobs']} /></li>
			</ul>
		</section>
	</section>
</section>

<style>
	@property --border-gradient-angle {
		inherits: false;
		initial-value: 0deg;
		syntax: '<angle>';
	}

	._border-gradient {
		--border-gradient-angle: 0deg;

		&::after,
		&::before {
			content: '';

			position: absolute;
			z-index: -1;
			inset: calc(-0.25 * var(--spacing));

			background: conic-gradient(
				from var(--border-gradient-angle),
				var(--color-primary) 0%,
				var(--color-secondary) 50%,
				var(--color-primary) 100%
			);

			animation: 2s spin linear infinite;
		}

		&::before {
			filter: blur(0.1rem);
		}
	}

	@keyframes spin {
		from {
			--border-gradient-angle: 0deg;
		}

		to {
			--border-gradient-angle: 360deg;
		}
	}
</style>
