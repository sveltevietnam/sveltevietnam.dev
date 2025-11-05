<script lang="ts">
	import { Context, T } from '@sveltevietnam/i18n';
	import type { Key } from '@sveltevietnam/i18n/generated';
	import { Breadcrumbs } from '@sveltevietnam/kit/components';
	import { COLOR_SCHEMES, SPLASH_OPTIONS } from '@sveltevietnam/kit/constants';
	import {
		ColorSchemeContext,
		NotificationContext,
		RoutingContext,
	} from '@sveltevietnam/kit/contexts';
	import { superForm } from 'sveltekit-superforms';

	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { IntroSeparator } from '$lib/components/intro-separator';
	import { SplashScreenPlayground } from '$lib/components/splash-screen-playground';
	import * as pagefind from '$lib/pagefind/attributes';

	import type { PageProps } from './$types';
	import ColorSchemeSkeleton from './_page/components/ColorSchemeSkeleton.svelte';
	import imgIntro from './_page/images/lightbulb.svg?url';

	let { data }: PageProps = $props();

	const colorScheme = ColorSchemeContext.get();
	const routing = RoutingContext.get();
	const { toaster } = NotificationContext.get();
	const { t } = Context.get();

	let languageNames = $derived(new Intl.DisplayNames([routing.lang], { type: 'language' }));

	const { form, enhance, constraints, delayed, timeout } = superForm(data.form, {
		resetForm: false,
		invalidateAll: 'force',
		multipleSubmits: 'prevent',
		delayMs: 500,
		timeoutMs: 2000,
		onResult({ result }) {
			if (result.type === 'success') {
				const data = result.data as { default: boolean };
				// Scenario 1: user does not change language, submission stays on same page
				// -> check and update color scheme accordingly & fire notification
				colorScheme.user = $form.colorScheme;
				toaster.success({
					message: data.default
						? t({ key: 'notifications.settings.default' })
						: t({ key: 'notifications.settings.saved' }),
				});
			}
		},
	});

	const mColorScheme = {
		light: 'pages.settings.color_scheme.light',
		dark: 'pages.settings.color_scheme.dark',
		system: 'pages.settings.color_scheme.system',
	} as const satisfies Record<string, Key>;

	const languages = $derived({
		vi: {
			m: languageNames.of('vi'),
			icon: 'i-flag-vn',
		},
		en: {
			m: languageNames.of('en'),
			icon: 'i-flag-gb',
		},
	});

	const mSplash = {
		random: 'pages.settings.splash_screen.variants.random',
		short: 'pages.settings.splash_screen.variants.short',
		long: 'pages.settings.splash_screen.variants.long',
		disabled: 'pages.settings.splash_screen.variants.disabled',
	} as const satisfies Record<string, Key>;

	beforeNavigate(({ from, to, type }) => {
		if (
			from?.url.pathname === page.url.pathname &&
			to?.url.pathname !== page.url.pathname &&
			type === 'goto'
		) {
			// Scenario 2: user changes language, causing redirection
			// -> check and update color scheme accordingly & fire notification
			if (colorScheme.user !== $form.colorScheme) {
				colorScheme.user = $form.colorScheme;
			}
			toaster.success({
				message: t({ key: 'notifications.settings.saved' }),
			});
		}
	});
</script>

{#snippet checkmark()}
	<svg
		class="text-primary absolute bottom-full left-full h-auto w-5.5 opacity-0 peer-checked:opacity-100"
		xmlns="http://www.w3.org/2000/svg"
		width="22"
		height="23"
		fill="none"
	>
		<path
			stroke="currentcolor"
			stroke-width="1.5"
			d="M1.25 17V5M5.47 17.595l8.485-8.486M6 21.75h12"
		/>
	</svg>
{/snippet}

<main {...pagefind.page()}>
	<!-- intro -->
	<section class="space-y-section pt-intro-pad-top bg-gradient-primary-intro">
		<div
			class="max-w-pad tablet:flex-row tablet:gap-6 tablet:items-start flex flex-col justify-between"
		>
			<div class="tablet:space-y-8 space-y-6">
				<Breadcrumbs crumbs={data.routing.breadcrumbs} />
				<div class="space-y-4">
					<h1 class="c-text-heading-page text-primary-on-surface">
						<T key="pages.settings.heading" />
					</h1>
					<p class="c-text-subtitle-page max-w-readable">
						<T key="pages.settings.desc" />
					</p>
				</div>
			</div>
			<img
				class="max-tablet:self-end h-auto w-64"
				src={imgIntro}
				width="256"
				height="256"
				alt="a human holding hand with an anthropomorphized planet earth"
				fetchpriority="high"
				loading="eager"
				decoding="sync"
			/>
		</div>
		<IntroSeparator />
	</section>

	<form
		class="max-w-pad py-section relative space-y-15"
		method="POST"
		action="?/settings"
		use:enhance
	>
		<!-- Color scheme -->
		<section class="space-y-10" data-pagefind-body>
			<h2 class="c-text-heading border-b" id="color-scheme">
				<T key="pages.settings.color_scheme.heading" />
			</h2>
			<div class="flex flex-wrap gap-10">
				{#each COLOR_SCHEMES as scheme (scheme)}
					<label class="group relative block cursor-pointer">
						<input
							class="peer sr-only"
							type="radio"
							name="colorScheme"
							value={scheme}
							bind:group={$form.colorScheme}
							{...$constraints.colorScheme}
						/>
						<span
							class="border-onehalf border-outline peer-checked:border-primary relative block p-2 duration-400 group-hover:border-current group-hover:duration-75"
						>
							<ColorSchemeSkeleton class="w-50" {scheme} />
						</span>
						<span class="peer-checked:text-primary mt-2 block">
							<T key={mColorScheme[scheme]} />
						</span>
						{@render checkmark()}
					</label>
				{/each}
			</div>
		</section>

		<!-- Language -->
		<section class="space-y-10" data-pagefind-body>
			<h2 class="c-text-heading border-b" id="language">
				<T key="pages.settings.language.heading" />
			</h2>
			<div class="flex flex-wrap gap-10">
				{#each Object.entries(languages) as [lang, { icon, m }] (lang)}
					<label
						class="has-checked:border-primary border-onehalf border-outline group
						relative flex cursor-pointer items-center gap-4 p-4 duration-400 hover:border-current has-checked:duration-75"
					>
						<input
							class="peer sr-only"
							type="radio"
							value={lang}
							name="language"
							bind:group={$form.language}
							{...$constraints.language}
						/>
						<i class="i {icon} h-6"></i>
						<span data-pagefind-body>{m}</span>
						{@render checkmark()}
					</label>
				{/each}
			</div>
		</section>

		<!-- Splash screen -->
		<section class="space-y-10" data-pagefind-body>
			<h2 class="c-text-heading border-b" id="splash-screen">
				<T key="pages.settings.splash_screen.heading" />
			</h2>
			<div class="flex flex-wrap gap-6">
				{#each SPLASH_OPTIONS as variant (variant)}
					<label
						class="has-checked:border-primary border-onehalf border-outline group
						relative block min-w-34 cursor-pointer gap-4 px-6 py-3 text-center duration-400
						hover:border-current has-checked:duration-75"
					>
						<input
							class="peer sr-only"
							type="radio"
							value={variant}
							name="splash"
							bind:group={$form.splash}
							{...$constraints.splash}
						/>
						<span data-pagefind-body>
							<T key={mSplash[variant]} />
						</span>
						{@render checkmark()}
					</label>
				{/each}
			</div>
			<p data-pagefind-body>
				<T key="pages.settings.splash_screen.desc" />
			</p>
			<SplashScreenPlayground />
		</section>

		<!-- CTAs -->
		<div
			class="tablet:gap-10 border-outline bg-surface sticky bottom-0 flex justify-end gap-6
			border-t py-6"
		>
			<div
				class="from-surface absolute bottom-full mb-px h-15 w-full bg-gradient-to-t from-20% to-transparent"
			></div>

			<label class="c-btn c-btn--outlined w-33" data-delayed={$delayed} data-timeout={$timeout}>
				<input value="1" name="default" type="submit" class="sr-only" />
				<span>
					<T key="pages.settings.ctas.default" />
				</span>
			</label>
			<button class="c-btn w-33" type="submit" data-delayed={$delayed} data-timeout={$timeout}>
				<span><T key="pages.settings.ctas.save" /></span>
			</button>
		</div>
	</form>
</main>
