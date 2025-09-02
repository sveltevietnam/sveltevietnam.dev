<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { Breadcrumbs } from '@sveltevietnam/kit/components';
	import { COLOR_SCHEMES, SPLASH_OPTIONS } from '@sveltevietnam/kit/constants';
	import { Contexts } from '@sveltevietnam/kit/contexts';
	import { superForm } from 'sveltekit-superforms';

	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import * as m from '$data/locales/generated/messages';
	import { IntroSeparator } from '$lib/components/intro-separator';
	import { SplashScreenPlayground } from '$lib/components/splash-screen-playground';
	import * as pagefind from '$lib/pagefind/attributes';

	import type { PageProps } from './$types';
	import ColorSchemeSkeleton from './_page/components/ColorSchemeSkeleton.svelte';
	import imgIntro from './_page/images/lightbulb.svg?url';

	let { data }: PageProps = $props();

	const { colorScheme, notifications: { toaster } } = Contexts.get();

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
						? m['notifications.settings.default']
						: m['notifications.settings.saved'],
				});
			}
		},
	});

	const mColorScheme = {
		light: m['pages.settings.color_scheme.light'],
		dark: m['pages.settings.color_scheme.dark'],
		system: m['pages.settings.color_scheme.system'],
	};

	const languages = {
		vi: {
			m: m['languages.vietnamese'],
			icon: 'i-flag-vn',
		},
		en: {
			m: m['languages.english'],
			icon: 'i-flag-gb',
		},
	};

	const mSplash = {
		random: m['pages.settings.splash_screen.variants.random'],
		short: m['pages.settings.splash_screen.variants.short'],
		long: m['pages.settings.splash_screen.variants.long'],
		disabled: m['pages.settings.splash_screen.variants.disabled'],
	};

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
				message: m['notifications.settings.saved'],
			});
		}
	});
</script>

{#snippet checkmark()}
	<svg
		class="w-5.5 text-primary absolute bottom-full left-full h-auto opacity-0 peer-checked:opacity-100"
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
				<Breadcrumbs
					crumbs={data.routing.breadcrumbs}
					i18n={{
						aria: m['components.breadcrumbs.aria'],
						home: m['components.breadcrumbs.home'],
					}}
				/>
				<div class="space-y-4">
					<h1 class="c-text-heading-page text-primary-on-surface">
						<T message={m['pages.settings.heading']} />
					</h1>
					<p class="c-text-subtitle-page max-w-readable">
						<T message={m['pages.settings.desc']} />
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
		class="max-w-pad py-section space-y-15 relative"
		method="POST"
		action="?/settings"
		use:enhance
	>
		<!-- Color scheme -->
		<section class="space-y-10" data-pagefind-body>
			<h2 class="c-text-heading border-b" id="color-scheme">
				<T message={m['pages.settings.color_scheme.heading']} />
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
							class="border-onehalf border-outline peer-checked:border-primary duration-400 relative block p-2 group-hover:border-current group-hover:duration-75"
						>
							<ColorSchemeSkeleton class="w-50" {scheme} />
						</span>
						<span class="peer-checked:text-primary mt-2 block">
							<T message={mColorScheme[scheme]} />
						</span>
						{@render checkmark()}
					</label>
				{/each}
			</div>
		</section>

		<!-- Language -->
		<section class="space-y-10" data-pagefind-body>
			<h2 class="c-text-heading border-b" id="language">
				<T message={m['pages.settings.language.heading']} />
			</h2>
			<div class="flex flex-wrap gap-10">
				{#each Object.entries(languages) as [lang, { icon, m }] (lang)}
					<label
						class="has-checked:border-primary border-onehalf border-outline has-checked:duration-75
						duration-400 group relative flex cursor-pointer items-center gap-4 p-4 hover:border-current"
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
						<span data-pagefind-body>
							<T message={m} />
						</span>
						{@render checkmark()}
					</label>
				{/each}
			</div>
		</section>

		<!-- Splash screen -->
		<section class="space-y-10" data-pagefind-body>
			<h2 class="c-text-heading border-b" id="splash-screen">
				<T message={m['pages.settings.splash_screen.heading']} />
			</h2>
			<div class="flex flex-wrap gap-6">
				{#each SPLASH_OPTIONS as variant (variant)}
					<label
						class="has-checked:border-primary border-onehalf border-outline has-checked:duration-75
						duration-400 min-w-34 group relative block cursor-pointer gap-4 px-6 py-3
						text-center hover:border-current"
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
							<T message={mSplash[variant]} />
						</span>
						{@render checkmark()}
					</label>
				{/each}
			</div>
			<p data-pagefind-body>
				<T message={m['pages.settings.splash_screen.desc']} />
			</p>
			<SplashScreenPlayground />
		</section>

		<!-- CTAs -->
		<div
			class="tablet:gap-10 border-outline bg-surface sticky bottom-0 flex justify-end gap-6
			border-t py-6"
		>
			<div
				class="from-surface h-15 absolute bottom-full mb-px w-full bg-gradient-to-t from-20% to-transparent"
			></div>

			<label class="c-btn c-btn--outlined w-33" data-delayed={$delayed} data-timeout={$timeout}>
				<input value="1" name="default" type="submit" class="sr-only" />
				<span>
					<T message={m['pages.settings.ctas.default']} />
				</span>
			</label>
			<button class="c-btn w-33" type="submit" data-delayed={$delayed} data-timeout={$timeout}>
				<span><T message={m['pages.settings.ctas.save']} /></span>
			</button>
		</div>
	</form>
</main>
