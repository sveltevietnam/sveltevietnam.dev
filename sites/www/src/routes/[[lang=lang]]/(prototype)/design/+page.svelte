<script lang="ts">
	import { Breadcrumbs } from '$client/components/Breadcrumbs';

	import type { PageData } from './$types';
	import imgNonla from './_page/images/logo-concept-nonla.webp';

	export let data: PageData;

	$: t = data.translations.page;
</script>

<main class="tp-body1">
	<div class="heading-container c-container-design">
		<Breadcrumbs breadcrumbs={data.breadcrumbs} class="mb-10" />
		<h1 class="tp-h1 font-medium uppercase">{t.title}</h1>
	</div>

	<div class="c-container-design space-y-20 pb-48 pt-20">
		<section class="space-y-16">
			<h2 class="tp-h2 font-medium">Logo</h2>

			<section class="space-y-12">
				<h3 class="tp-h3 font-medium">{t.logo.inspiration.title}</h3>
				<p>{@html t.logo.inspiration.content}</p>
				<div class="flex items-center gap-8">
					<img src={imgNonla} alt="nón lá" width="106" height="106" />
					<svg inline-src="icon/plus" width="32" height="32" class="stroke-current" />
					<svg inline-src="svelte" width="90" height="108" />
				</div>
			</section>

			<section class="space-y-12">
				<h3 class="tp-h3 font-medium">{t.logo.concept.title}</h3>
				<ul class="flex items-center gap-8 sp:flex-col">
					<li class="border px-12 py-6">{t.logo.concept.inspiration}</li>
					<li class="border px-12 py-6">{t.logo.concept.vietnam}</li>
					<li class="border px-12 py-6">{t.logo.concept.community}</li>
				</ul>
			</section>

			<section class="space-y-12">
				<h3 class="tp-h3 font-medium">{t.logo.versions.title}</h3>
				<ul class="flex items-center gap-8 sp:flex-col">
					<li class="logo-card-wrapper">
						<dt class="tp-caption2">{t.logo.versions.versions.original}</dt>
						<dd class="logo-card bg-design-bg-1">
							<svg
								inline-src="sveltevietnam"
								width="50"
								height="56"
								class="c-logo c-logo--original"
							/>
							<p>SVELTE<br />VIETNAM</p>
						</dd>
					</li>
					<li class="logo-card-wrapper">
						<dt class="tp-caption2">{t.logo.versions.versions.positive}</dt>
						<dd class="logo-card bg-design-grayscale-light-1 text-design-grayscale-dark-1">
							<svg
								inline-src="sveltevietnam"
								width="50"
								height="56"
								class="c-logo c-logo--positive"
							/>
							<p>SVELTE<br />VIETNAM</p>
						</dd>
					</li>
					<li class="logo-card-wrapper">
						<dt class="tp-caption2">{t.logo.versions.versions.negative}</dt>
						<dd class="logo-card bg-design-grayscale-dark-1 text-design-grayscale-light-1">
							<svg
								inline-src="sveltevietnam"
								width="50"
								height="56"
								class="c-logo c-logo--negative"
							/>
							<p>SVELTE<br />VIETNAM</p>
						</dd>
					</li>
				</ul>
			</section>

			<section class="space-y-12">
				<h3 class="tp-h3 font-medium">{t.logo.typeface.title}</h3>
				<div class="w-fit border px-4 py-4 font-inter tb:px-10 tb:py-5">
					<p class="typeface-caption">Typeface</p>
					<p class="typeface-heading">Inter</p>
					<div class="my-3 h-px w-full bg-design-fg-1" />
					<div class="typeface-bold">
						<p>Inter / Bold</p>
						<p>abcdefghijklmnopqrstuvwxyz</p>
						<p class="uppercase">abcdefghijklmnopqrstuvwxyz</p>
						<p class="uppercase">0123456789</p>
					</div>
					<div class="my-3 h-px w-full bg-design-fg-1" />
					<div class="typeface-normal">
						<p>Inter / Regular</p>
						<p>abcdefghijklmnopqrstuvwxyz</p>
						<p class="uppercase">abcdefghijklmnopqrstuvwxyz</p>
						<p class="uppercase">0123456789</p>
					</div>
				</div>
			</section>
		</section>
	</div>
</main>

<style lang="postcss">
	.heading-container {
		margin-top: calc(-1 * theme('spacing.header'));
		padding-top: calc(theme('spacing.header') + 20px);
		padding-bottom: 80px;
		background: theme('colors.design.bg.2');
	}

	.logo-card-wrapper {
		display: flex;
		flex-direction: column-reverse;
		gap: 8px;
	}

	.logo-card {
		display: flex;
		gap: 16px;
		align-items: center;

		padding: 32px 52px;

		border: 1px solid theme('colors.outline.DEFAULT');
	}

	.typeface-caption {
		font-size: 14px;
		font-weight: 700;
		line-height: 150%;
	}

	.typeface-heading {
		margin-top: 17px;
		font-size: 64px;
		font-weight: 700;
		line-height: normal;
	}

	.typeface-bold {
		font-size: 16px;
		font-weight: 700;
		line-height: 150%;
	}
</style>
