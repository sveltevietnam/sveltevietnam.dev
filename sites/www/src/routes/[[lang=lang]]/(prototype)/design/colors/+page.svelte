<script lang="ts">
	import { Breadcrumbs } from '$client/components/Breadcrumbs';

	import type { PageData } from './$types';

	export let data: PageData;

	$: t = data.translations.page;
</script>

<main class="tp-body1">
	<div class="heading-container c-container-design">
		<Breadcrumbs breadcrumbs={data.breadcrumbs} class="mb-10" />
		<h1 class="tp-h2@sp font-medium uppercase tb:tp-h1@pc">{t.title}</h1>
	</div>
	<div class="c-container-design pb-40 pt-20">
		<section class="space-y-[60px]">
			<h2 class="tp-h2 font-medium">{t.primitives.title}</h2>

			<section>
				<h3 class="tp-h3 font-medium">{t.primitives.colors.white}</h3>
				<ul class="primitive-group">
					<li class="bg-white-50">50</li>
					<li class="bg-white-100">100</li>
					<li class="bg-white-200">200</li>
					<li class="bg-white-300">300</li>
					<li class="bg-white-400">400</li>
					<li class="bg-white-500">500</li>
					<li class="bg-white-600">600</li>
					<li class="bg-white-700">700</li>
					<li class="bg-white-800">800</li>
					<li class="bg-white-900">900</li>
					<li class="primitive-base border border-black bg-white text-black">base</li>
				</ul>
			</section>

			<section>
				<h3 class="tp-h3 font-medium">{t.primitives.colors.black}</h3>
				<ul class="primitive-group">
					<li class="bg-black-50">50</li>
					<li class="bg-black-100">100</li>
					<li class="bg-black-200">200</li>
					<li class="bg-black-300">300</li>
					<li class="bg-black-400">400</li>
					<li class="bg-black-500">500</li>
					<li class="bg-black-600">600</li>
					<li class="bg-black-700">700</li>
					<li class="bg-black-800">800</li>
					<li class="bg-black-900">900</li>
					<li class="primitive-base bg-black">base</li>
				</ul>
			</section>

			<section>
				<h3 class="tp-h3 font-medium">{t.primitives.colors.orange}</h3>
				<ul class="primitive-group">
					<li class="bg-orange-50">50</li>
					<li class="bg-orange-100">100</li>
					<li class="bg-orange-200">200</li>
					<li class="bg-orange-300">300</li>
					<li class="bg-orange-400">400</li>
					<li class="bg-orange-500">500</li>
					<li class="bg-orange-600">600</li>
					<li class="bg-orange-700">700</li>
					<li class="bg-orange-800">800</li>
					<li class="bg-orange-900">900</li>
					<li class="primitive-base bg-orange">base</li>
				</ul>
			</section>

			<section>
				<h3 class="tp-h3 font-medium">{t.primitives.colors.green}</h3>
				<ul class="primitive-group">
					<li class="bg-green-50">50</li>
					<li class="bg-green-100">100</li>
					<li class="bg-green-200">200</li>
					<li class="bg-green-300">300</li>
					<li class="bg-green-400">400</li>
					<li class="bg-green-500">500</li>
					<li class="bg-green-600">600</li>
					<li class="bg-green-700">700</li>
					<li class="bg-green-800">800</li>
					<li class="bg-green-900">900</li>
					<li class="primitive-base bg-green">base</li>
				</ul>
			</section>

			<section>
				<h3 class="tp-h3 font-medium">{t.primitives.colors.folly}</h3>
				<ul class="primitive-group">
					<li class="bg-folly-50">50</li>
					<li class="bg-folly-100">100</li>
					<li class="bg-folly-200">200</li>
					<li class="bg-folly-300">300</li>
					<li class="bg-folly-400">400</li>
					<li class="bg-folly-500">500</li>
					<li class="bg-folly-600">600</li>
					<li class="bg-folly-700">700</li>
					<li class="bg-folly-800">800</li>
					<li class="bg-folly-900">900</li>
					<li class="primitive-base bg-folly">base</li>
				</ul>
			</section>

			<section>
				<h3 class="tp-h3 font-medium">{t.primitives.colors.amber}</h3>
				<ul class="primitive-group">
					<li class="bg-amber-50">50</li>
					<li class="bg-amber-100">100</li>
					<li class="bg-amber-200">200</li>
					<li class="bg-amber-300">300</li>
					<li class="bg-amber-400">400</li>
					<li class="bg-amber-500">500</li>
					<li class="bg-amber-600">600</li>
					<li class="bg-amber-700">700</li>
					<li class="bg-amber-800">800</li>
					<li class="bg-amber-900">900</li>
					<li class="primitive-base bg-amber">base</li>
				</ul>
			</section>

			<section>
				<h3 class="tp-h3 font-medium">{t.primitives.colors.emerald}</h3>
				<ul class="primitive-group">
					<li class="bg-emerald-50">50</li>
					<li class="bg-emerald-100">100</li>
					<li class="bg-emerald-200">200</li>
					<li class="bg-emerald-300">300</li>
					<li class="bg-emerald-400">400</li>
					<li class="bg-emerald-500">500</li>
					<li class="bg-emerald-600">600</li>
					<li class="bg-emerald-700">700</li>
					<li class="bg-emerald-800">800</li>
					<li class="bg-emerald-900">900</li>
					<li class="primitive-base bg-emerald">base</li>
				</ul>
			</section>

			<section>
				<h3 class="tp-h3 font-medium">{t.primitives.colors.blue}</h3>
				<ul class="primitive-group">
					<li class="bg-blue-50">50</li>
					<li class="bg-blue-100">100</li>
					<li class="bg-blue-200">200</li>
					<li class="bg-blue-300">300</li>
					<li class="bg-blue-400">400</li>
					<li class="bg-blue-500">500</li>
					<li class="bg-blue-600">600</li>
					<li class="bg-blue-700">700</li>
					<li class="bg-blue-800">800</li>
					<li class="bg-blue-900">900</li>
					<li class="primitive-base bg-blue">base</li>
				</ul>
			</section>

			<section>
				<h3 class="tp-h3 font-medium">{t.primitives.colors.neutral}</h3>
				<ul class="primitive-group">
					<li class="bg-neutral-50">50</li>
					<li class="bg-neutral-100">100</li>
					<li class="bg-neutral-200">200</li>
					<li class="bg-neutral-300">300</li>
					<li class="bg-neutral-400">400</li>
					<li class="bg-neutral-500">500</li>
					<li class="bg-neutral-600">600</li>
					<li class="bg-neutral-700">700</li>
					<li class="bg-neutral-800">800</li>
					<li class="bg-neutral-900">900</li>
					<li class="primitive-base bg-neutral">base</li>
				</ul>
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

	.primitive-group {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;

		margin-top: 40px;

		font-size: 18px;
		font-weight: theme('fontWeight.medium');
		line-height: 1;
		color: theme('colors.black.DEFAULT');
		text-align: center;

		@screen tb {
			grid-template-columns: repeat(5, 1fr);
		}

		@screen pc {
			grid-template-columns: repeat(10, 1fr);
		}

		:global(:where(& > *)) {
			padding: 24px;
			border-radius: 8px;
		}

		:global(:where(& > *:nth-child(n + 7))) {
			color: theme('colors.white.DEFAULT');
		}

		:global(:where(& .primitive-base)) {
			grid-column: span 2;
			color: theme('colors.white.DEFAULT');

			@screen tb {
				grid-column: span 5;
			}

			@screen pc {
				grid-column: span 10;
			}
		}
	}
</style>
