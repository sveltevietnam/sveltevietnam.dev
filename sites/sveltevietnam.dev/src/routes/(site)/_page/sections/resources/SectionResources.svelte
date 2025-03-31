<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import type { Message } from '@sveltevietnam/i18n/runtime';
	import type { Picture } from 'vite-imagetools';

	import { SOCIAL_LINKS } from '$data/links';

	import imgPuzzle from './images/puzzle.png?enhanced';
	import screenshotDocs from './images/screenshot-svelte-docs.jpg?enhanced';
	import screenshotGithub from './images/screenshot-svelte-github.jpg?enhanced';
	import screenshotHack from './images/screenshot-svelte-hack.jpg?enhanced';
	import screenshotLab from './images/screenshot-svelte-lab.jpg?enhanced';
	import screenshotPlayground from './images/screenshot-svelte-playground.jpg?enhanced';
	import screenshotSociety from './images/screenshot-svelte-society.jpg?enhanced';
	import screenshotSummit from './images/screenshot-svelte-summit.jpg?enhanced';
	import screenshotTutorial from './images/screenshot-svelte-tutorial.jpg?enhanced';

	let { locale }: { locale: import('./locales/generated').Locale } = $props();

	const sectionClasses = [
		'relative bg-surface p-4 flex flex-col gap-8 max-w-256 mx-auto',
		'tablet:p-10 tablet:gap-15',
		'before:absolute before:-z-1 before:-inset-0.5 before:bg-gradient-to-b before:from-on-surface before:via-svelte before:to-transparent',
	];
</script>

{#snippet step(message: Message<never>)}
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
	description: Message<never>;
	links: { message: Message<never>; href: string }[];
	linksClasses?: string;
	image: Picture | { message: Message<never>; href: string; src: Picture };
	footnote?: Message<never>;
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
						<i class="i i-[arrow-square-out] h-6 w-6"></i>
					</a>
				{/each}
			</div>
			{#if footnote}
				<p class="mobile:order-4">
					<em><T message={footnote} /></em>
				</p>
			{/if}
		</div>
		{#if !('href' in image)}
			<div class="tablet:flex-1 mobile:order-2">
				<enhanced:img class="w-full" src={image} alt="" />
			</div>
		{:else}
			<div
				class="from-primary to-tertiary mobile:order-2 tablet:flex-1 h-fit
				bg-gradient-to-r p-0.5 group-odd:bg-gradient-to-l"
			>
				<a class="c-link-image block" href={image.href}>
					<span class="sr-only"><T message={image.message} /></span>
					<enhanced:img src={image.src} alt="" />
				</a>
			</div>
		{/if}
	</div>
{/snippet}

<section class="max-w-pad pb-section space-y-30">
	<h2 class="c-text-heading-lg text-center"><T message={locale.heading} /></h2>

	<section class={[...sectionClasses, 'tablet:max-desktop:pb-32']}>
		<div class="relative flex items-center justify-between gap-4">
			<div class="space-y-4">
				{@render step(locale.one)}
				<h3 class="c-text-heading-md"><T message={locale.one_heading} /></h3>
			</div>
			<svg
				class="mobile:absolute mobile:-top-2 mobile:-right-2 w-25 h-auto shrink-0"
				inline-src="./images/box"
			></svg>
		</div>

		{@render resource({
			description: locale.one_tutorial,
			links: [{ message: locale.one_tutorial_link, href: 'https://svelte.dev/tutorial' }],
			linksClasses: 'w-fit',
			image: {
				message: locale.one_tutorial_link,
				href: 'https://svelte.dev/tutorial',
				src: screenshotTutorial,
			},
			footnote: locale.one_tutorial_footnote,
		})}

		{@render resource({
			description: locale.one_playground,
			links: [{ message: locale.one_playground_link, href: 'https://svelte.dev/playground' }],
			linksClasses: 'w-fit',
			image: {
				message: locale.one_playground_link,
				href: 'https://svelte.dev/playground',
				src: screenshotPlayground,
			},
		})}

		{@render resource({
			description: locale.one_lab,
			links: [{ message: locale.one_lab_link, href: 'https://www.sveltelab.dev/' }],
			linksClasses: 'ml-auto w-fit',
			image: {
				message: locale.one_lab_link,
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
				{@render step(locale.two)}
				<h3 class="c-text-heading-md text-right"><T message={locale.two_heading} /></h3>
			</div>
		</div>

		{@render resource({
			description: locale.two_docs,
			links: [{ message: locale.two_docs_link, href: 'https://svelte.dev/docs' }],
			linksClasses: 'w-fit',
			image: {
				message: locale.two_docs_link,
				href: 'https://svelte.dev/docs',
				src: screenshotDocs,
			},
		})}
	</section>

	<section class={sectionClasses}>
		<div class="space-y-4">
			{@render step(locale.three)}
			<h3 class="c-text-heading-md text-right"><T message={locale.three_heading} /></h3>
		</div>

		{@render resource({
			description: locale.three_description,
			links: [
				{ message: locale.three_discord, href: SOCIAL_LINKS.DISCORD },
				{ message: locale.bluesky, href: SOCIAL_LINKS.BLUESKY },
				{ message: locale.three_github, href: SOCIAL_LINKS.GITHUB },
			],
			image: imgPuzzle,
		})}
		<p class="-mt-4"><T message={locale.three_note} /></p>
	</section>

	<section class={sectionClasses}>
		<div class="flex items-start justify-between gap-4">
			<svg class="h-20 w-20 shrink-0" inline-src="./images/svelte-society-logo"></svg>
			<div class="flex flex-col items-end gap-4">
				{@render step(locale.four)}
				<h3 class="c-text-heading-md text-right"><T message={locale.four_heading} /></h3>
			</div>
		</div>

		{@render resource({
			description: locale.four_svelte,
			links: [
				{ message: locale.four_github_svelte, href: 'https://github.com/sveltejs/svelte' },
				{ message: locale.four_github_sveltekit, href: 'https://github.com/sveltejs/kit' },
				{ message: locale.four_github_svelte_dev, href: 'https://github.com/sveltejs/svelte.dev' },
				{ message: locale.bluesky, href: 'https://bsky.app/profile/svelte.dev' },
			],
			image: {
				message: locale.four_github_svelte,
				href: 'https://github.com/sveltejs',
				src: screenshotGithub,
			},
		})}

		{@render resource({
			description: locale.four_society,
			links: [
				{ message: locale.four_society_discord, href: 'https://svelte.dev/chat' },
				{ message: locale.bluesky, href: 'https://bsky.app/profile/sveltesociety.dev' },
				{ message: locale.four_society_website, href: 'https://www.sveltesociety.dev/' },
			],
			image: {
				message: locale.four_society_website,
				href: 'https://www.sveltesociety.dev/',
				src: screenshotSociety,
			},
		})}

		{@render resource({
			description: locale.four_summit,
			links: [
				{ message: locale.four_summit_youtube, href: 'https://www.youtube.com/@SvelteSociety' },
				{ message: locale.four_summit_website, href: 'https://www.sveltesummit.com/' },
			],
			image: {
				message: locale.four_summit_website,
				href: 'https://www.sveltesummit.com/',
				src: screenshotSummit,
			},
		})}

		{@render resource({
			description: locale.four_hack,
			links: [{ message: locale.four_hack_link, href: 'https://hack.sveltesociety.dev' }],
			image: {
				message: locale.four_hack_link,
				href: 'https://hack.sveltesociety.dev',
				src: screenshotHack,
			},
		})}

		<div class="bg-outline h-px w-full"></div>

		<section class="prose max-w-[80ch] leading-relaxed">
			<p><T message={locale.four_others} /></p>
			<ul class="">
				<li><T message={locale.four_newsletter} /></li>
				<li><T message={locale.four_madebysvelte} /></li>
				<li><T message={locale.four_jobs} /></li>
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
