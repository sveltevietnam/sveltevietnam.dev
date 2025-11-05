<script lang="ts">
	import { Context, T } from '@sveltevietnam/i18n';
	import { RoutingContext } from '@sveltevietnam/kit/contexts';

	import * as p from '$data/routes/generated';
	import { VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN } from '$env/static/public';

	import kvAbout from './_local/images/kv-about.svg';
	import kvCatch from './_local/images/kv-catch.svg';
	import kvForAll from './_local/images/kv-for-all.svg';
	import kvIntro from './_local/images/kv-intro.svg';
	import kvOpen from './_local/images/kv-open.svg';
	import kvSimpleSecure from './_local/images/kv-simple-secure.svg';

	const { t } = Context.get();
	const routing = RoutingContext.get();

	const sponsorLink = $derived(
		`${VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN}/${routing.lang}/${
			routing.lang === 'en' ? 'sponsor' : 'tai-tro'
		}#why`,
	);

	const sourceLink =
		'https://github.com/sveltevietnam/sveltevietnam.dev/tree/main/sites/recruit.sveltevietnam.dev';
</script>

<main>
	<section
		class="desktop:gap-25 max-w-pad border-b-onehalf border-on-surface-dim tablet:flex-row desktop:flex-row-reverse tablet:gap-10 flex flex-col"
		id="intro"
	>
		<div class=" tablet:pt-40 desktop:pt-60 flex-1 pt-24">
			<div class="max-w-readable tablet:space-y-8 desktop:space-y-10 mx-auto space-y-6">
				<h1 class="desktop:space-y-4 space-y-2">
					<span class="c-text-heading-page block"><T key="pages.home.intro.heading" /></span>
					<span class="c-text-heading block"><T key="pages.home.intro.subtitle" /></span>
				</h1>
				<p>
					<T
						key="pages.home.intro.desc"
						params={{ mainSiteUrl: VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN }}
					/>
				</p>
				<div class="mobile:ml-auto relative w-fit">
					<a
						class="c-btn c-btn--pop block w-fit"
						href={p['/:lang/authenticate']({ lang: routing.lang })}
					>
						<T key="pages.home.intro.cta" />
					</a>
					<svg
						class="text-on-surface-dim mobile:hidden tablet:w-62 absolute top-full left-full h-auto
						w-50 translate-y-6"
						xmlns="http://www.w3.org/2000/svg"
						width="200"
						height="64"
						fill="none"
					>
						<path
							fill="currentcolor"
							d="M151.5 64c-.8
							0-1.6-.1-2.5-.2-4.2-.8-8.1-3.5-10.2-7.1-3-5.2-3.2-12.1-.7-19a43.9 43.9 0 00-4.9.9c-8.9
							2.1-17.4 6.4-25.6 10.5C95.8 54.9 83.6 61 70.3 61h-.2c-7.3
							0-14.8-2-22.1-5.7-6.5-3.3-12.9-8.2-18.5-14C18.8 30.1 11.3 16.3 4.1 3a1 1 0 01.4-1.3 1 1 0
							011.3.4C13 15.2 20.5 28.8 31 39.8 42.7 52.1 56.6 58.9 70.1 59c12.9.1 24.4-5.6 36.6-11.7
							8.3-4.1 17-8.4 26.1-10.6a44.8 44.8 0 016.2-1.1c.1-.2.2-.4.3-.6 2.5-5.4 6.5-10.2
							11.5-13.9s10.7-6 16.5-6.9c5.9-.8 12-.1 17.7 2.1s10.8 5.7 14.7 10.2a1 1 0 01-.1 1.4 1 1 0
							01-1.4-.1c-7.5-8.6-19.5-13.2-30.8-11.6-11.1 1.6-21.4 9.1-26.3 19.2 5.1-.2 10.5.7 15 4.1 3.7
							2.8 6.2 7.7 6.3 12.5.1 4-1.3 7.3-4 9.5-1.9 1.6-4.3 2.4-7 2.4ZM140.3 37.5c-2.7 6.6-2.6 13.3.2
							18.2 1.8 3.1 5.2 5.5 8.8 6.2 3 .6 5.8-.1 7.9-1.8 2.2-1.8 3.4-4.6
							3.3-8-.1-4.3-2.3-8.6-5.5-11-4.4-3.2-9.8-4-14.7-3.6Z"
						></path>
						<path fill="currentcolor" d="M18.1 4.8 3.7 0 0 14.9l2.5.6 3-12.2L17.3 7.2l.8-2.4Z"
						></path>
					</svg>
				</div>
			</div>
		</div>
		<div class="translate-y-0.5">
			<img
				class="tablet:w-69 desktop:w-91 widescreen:w-100 h-auto w-full 2xl:w-120"
				src={kvIntro}
				alt={await t({ key: 'pages.home.intro.kv_alt' })}
				width="276"
				height="601"
			/>
		</div>
	</section>

	<div class="pb-section">
		<!-- What's the catch? -->
		<section
			class="desktop:gap-20 tablet:max-desktop:items-end tablet:flex-row-reverse desktop:flex-row
			max-w-pad py-section-more flex flex-col gap-10"
			id="what-is-the-catch"
		>
			<div class="tablet:space-y-8 desktop:space-y-10 flex-1 space-y-6">
				<h2 class="c-text-heading-lg">
					<T key="pages.home.catch.heading" />
				</h2>
				<p>
					<T key="pages.home.catch.desc" />
				</p>
				<a
					class="c-btn c-btn--pop block w-fit"
					href={sponsorLink}
					target="_blank"
					rel="noopener noreferrer external"
				>
					<T key="pages.home.catch.cta" />
				</a>
			</div>
			<div class="flex-1">
				<img
					class="tablet:max-desktop:-scale-x-100 h-auto w-full"
					src={kvCatch}
					alt={await t({ key: 'pages.home.catch.kv_alt' })}
					width="345"
					height="293"
				/>
			</div>
		</section>

		<!-- Simple and Secure -->
		<section
			class="max-w-pad py-section-more bg-primary-surface text-primary-on-surface space-y-10"
			id="simple-and-secure"
		>
			<h2 class="c-text-heading-lg text-center">
				<T key="pages.home.simple_secure.heading" />
			</h2>
			<div
				class="tablet:flex-row desktop:flex-row-reverse tablet:gap-0 flex flex-col items-center
				justify-center gap-6"
			>
				<ul
					class="tablet:space-y-4 desktop:space-y-6 tablet:text-left tablet:c-text-subtitle-page space-y-2
					text-center"
				>
					<li>
						<T key="pages.home.simple_secure.steps.one" />
					</li>
					<li class="desktop:pl-6">
						<T key="pages.home.simple_secure.steps.two" />
					</li>
					<li class="desktop:pl-12">
						<T key="pages.home.simple_secure.steps.three" />
					</li>
				</ul>
				<div>
					<img
						class="max-tablet:-scale-x-100 h-auto w-90 max-w-full"
						src={kvSimpleSecure}
						alt={await t({ key: 'pages.home.simple_secure.kv_alt' })}
						width="357"
						height="362"
					/>
				</div>
			</div>
		</section>

		<!-- About Svelte Vietnam -->
		<section
			class="desktop:gap-20 tablet:max-desktop:items-end tablet:flex-row-reverse
			desktop:flex-row
			max-w-pad py-section-more flex flex-col gap-10"
			id="about-svelte-vietnam"
		>
			<div class="tablet:space-y-8 desktop:space-y-10 flex-1 space-y-6">
				<h2 class="c-text-heading-lg">
					<T key="pages.home.about.heading" />
				</h2>
				<p>
					<T key="pages.home.about.desc" />
				</p>
				<a
					class="c-btn c-btn--pop block w-fit"
					href="{VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN}/{routing.lang}"
					target="_blank"
				>
					<T key="pages.home.about.cta" />
				</a>
			</div>
			<div class="flex-1">
				<img
					class="desktop:-scale-x-100 h-auto w-full"
					src={kvAbout}
					alt={await t({ key: 'pages.home.about.kv_alt' })}
					width="345"
					height="228"
				/>
			</div>
		</section>

		<!-- For all -->
		<section
			class="max-w-pad py-section-more bg-primary-surface text-primary-on-surface tablet:space-y-14
			desktop:space-y-16 space-y-10"
			id="one-for-all"
		>
			<h2 class="c-text-heading-lg text-center">
				<T key="pages.home.for_all.heading" />
			</h2>
			<p class="tablet:c-text-subtitle-page max-w-readable mx-auto text-center leading-relaxed">
				<T key="pages.home.for_all.desc" />
			</p>
			<img
				class="mx-auto h-auto w-196 max-w-full"
				src={kvForAll}
				alt={await t({ key: 'pages.home.for_all.kv_alt' })}
				width="345"
				height="142"
			/>
		</section>

		<!-- Open source -->
		<section
			class="desktop:gap-20 tablet:max-desktop:items-end tablet:flex-row desktop:flex-row-reverse
			max-w-pad py-section-more flex flex-col gap-10"
			id="open-source"
		>
			<div class="tablet:space-y-8 desktop:space-y-10 flex-1 space-y-6">
				<h2 class="c-text-heading-lg">
					<T key="pages.home.open.heading" />
				</h2>
				<p>
					<T key="pages.home.open.desc" />
				</p>
				<a
					class="c-btn c-btn--pop block w-fit"
					href={sourceLink}
					target="_blank"
					rel="noopener noreferrer external"
				>
					<T key="pages.home.open.cta" />
				</a>
			</div>
			<div class="flex-1">
				<img
					class="h-auto w-full"
					src={kvOpen}
					alt={await t({ key: 'pages.home.open.kv_alt' })}
					width="343"
					height="291"
				/>
			</div>
		</section>
	</div>
</main>
