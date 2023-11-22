<script lang="ts">
	import { Breadcrumbs } from '$client/components/Breadcrumbs';
	import BaseNotification from '$client/notifications/BaseNotification.svelte';
	import { STATUSES } from '$shared/constants';

	import type { PageData } from './$types';

	export let data: PageData;

	$: t = data.translations.page;

	const statusColorClasses = {
		info: {
			surface: {
				base: 'bg-info-surface',
				100: 'bg-info-surface-100',
				200: 'bg-info-surface-200',
			},
			element: 'bg-info-element',
			text: 'text-info-text',
		},
		success: {
			surface: {
				base: 'bg-success-surface',
				100: 'bg-success-surface-100',
				200: 'bg-success-surface-200',
			},
			element: 'bg-success-element',
			text: 'text-success-text',
		},
		warning: {
			surface: {
				base: 'bg-warning-surface',
				100: 'bg-warning-surface-100',
				200: 'bg-warning-surface-200',
			},
			element: 'bg-warning-element',
			text: 'text-warning-text',
		},
		error: {
			surface: {
				base: 'bg-error-surface',
				100: 'bg-error-surface-100',
				200: 'bg-error-surface-200',
			},
			element: 'bg-error-element',
			text: 'text-error-text',
		},
	} as const;
</script>

<main class="tp-body1">
	<div class="heading-container c-container-design">
		<Breadcrumbs breadcrumbs={data.breadcrumbs} class="mb-10" />
		<h1 class="tp-h2@sp font-medium uppercase tb:tp-h1@pc">{t.title}</h1>
	</div>
	<div class="c-container-design space-y-[120px] pb-40 pt-20">
		<section class="space-y-[60px]">
			<h2 class="tp-h2 font-medium">{t.primitives.title}</h2>

			<section>
				<h3 class="tp-h3 font-medium">{t.primitives.colors.grayscale}</h3>
				<ul class="primitive-group grayscale">
					<li
						class="swatch primitive-base border border-grayscale-black bg-white text-grayscale-black"
					>
						white
					</li>
					<li class="swatch bg-grayscale-50">50</li>
					<li class="swatch bg-grayscale-100">100</li>
					<li class="swatch bg-grayscale-200">200</li>
					<li class="swatch bg-grayscale-300">300</li>
					<li class="swatch bg-grayscale-400">400</li>
					<li class="swatch bg-grayscale-500">500</li>
					<li class="swatch bg-grayscale-600">600</li>
					<li class="swatch bg-grayscale-700">700</li>
					<li class="swatch bg-grayscale-800">800</li>
					<li class="swatch bg-grayscale-900">900</li>
					<li class="swatch bg-grayscale-950">950</li>
					<li
						class="swatch primitive-base border border-grayscale-white bg-grayscale-black text-grayscale-white"
					>
						black
					</li>
				</ul>
			</section>

			<section>
				<h3 class="tp-h3 font-medium">{t.primitives.colors.orange}</h3>
				<ul class="primitive-group">
					<li class="swatch bg-orange-50">50</li>
					<li class="swatch bg-orange-100">100</li>
					<li class="swatch bg-orange-200">200</li>
					<li class="swatch bg-orange-300">300</li>
					<li class="swatch bg-orange-400">400</li>
					<li class="swatch bg-orange-500">500</li>
					<li class="swatch bg-orange-600">600</li>
					<li class="swatch bg-orange-700">700</li>
					<li class="swatch bg-orange-800">800</li>
					<li class="swatch bg-orange-900">900</li>
					<li class="swatch primitive-base bg-orange">base</li>
				</ul>
			</section>

			<section>
				<h3 class="tp-h3 font-medium">{t.primitives.colors.green}</h3>
				<ul class="primitive-group">
					<li class="swatch bg-green-50">50</li>
					<li class="swatch bg-green-100">100</li>
					<li class="swatch bg-green-200">200</li>
					<li class="swatch bg-green-300">300</li>
					<li class="swatch bg-green-400">400</li>
					<li class="swatch bg-green-500">500</li>
					<li class="swatch bg-green-600">600</li>
					<li class="swatch bg-green-700">700</li>
					<li class="swatch bg-green-800">800</li>
					<li class="swatch bg-green-900">900</li>
					<li class="swatch primitive-base bg-green">base</li>
				</ul>
			</section>

			<section>
				<h3 class="tp-h3 font-medium">{t.primitives.colors.folly}</h3>
				<ul class="primitive-group">
					<li class="swatch bg-folly-50">50</li>
					<li class="swatch bg-folly-100">100</li>
					<li class="swatch bg-folly-200">200</li>
					<li class="swatch bg-folly-300">300</li>
					<li class="swatch bg-folly-400">400</li>
					<li class="swatch bg-folly-500">500</li>
					<li class="swatch bg-folly-600">600</li>
					<li class="swatch bg-folly-700">700</li>
					<li class="swatch bg-folly-800">800</li>
					<li class="swatch bg-folly-900">900</li>
					<li class="swatch primitive-base bg-folly">base</li>
				</ul>
			</section>

			<section>
				<h3 class="tp-h3 font-medium">{t.primitives.colors.amber}</h3>
				<ul class="primitive-group">
					<li class="swatch bg-amber-50">50</li>
					<li class="swatch bg-amber-100">100</li>
					<li class="swatch bg-amber-200">200</li>
					<li class="swatch bg-amber-300">300</li>
					<li class="swatch bg-amber-400">400</li>
					<li class="swatch bg-amber-500">500</li>
					<li class="swatch bg-amber-600">600</li>
					<li class="swatch bg-amber-700">700</li>
					<li class="swatch bg-amber-800">800</li>
					<li class="swatch bg-amber-900">900</li>
					<li class="swatch primitive-base bg-amber">base</li>
				</ul>
			</section>

			<section>
				<h3 class="tp-h3 font-medium">{t.primitives.colors.emerald}</h3>
				<ul class="primitive-group">
					<li class="swatch bg-emerald-50">50</li>
					<li class="swatch bg-emerald-100">100</li>
					<li class="swatch bg-emerald-200">200</li>
					<li class="swatch bg-emerald-300">300</li>
					<li class="swatch bg-emerald-400">400</li>
					<li class="swatch bg-emerald-500">500</li>
					<li class="swatch bg-emerald-600">600</li>
					<li class="swatch bg-emerald-700">700</li>
					<li class="swatch bg-emerald-800">800</li>
					<li class="swatch bg-emerald-900">900</li>
					<li class="swatch primitive-base bg-emerald">base</li>
				</ul>
			</section>

			<section>
				<h3 class="tp-h3 font-medium">{t.primitives.colors.blue}</h3>
				<ul class="primitive-group">
					<li class="swatch bg-blue-50">50</li>
					<li class="swatch bg-blue-100">100</li>
					<li class="swatch bg-blue-200">200</li>
					<li class="swatch bg-blue-300">300</li>
					<li class="swatch bg-blue-400">400</li>
					<li class="swatch bg-blue-500">500</li>
					<li class="swatch bg-blue-600">600</li>
					<li class="swatch bg-blue-700">700</li>
					<li class="swatch bg-blue-800">800</li>
					<li class="swatch bg-blue-900">900</li>
					<li class="swatch primitive-base bg-blue">base</li>
				</ul>
			</section>

			<section>
				<h3 class="tp-h3 font-medium">{t.primitives.colors.stone}</h3>
				<ul class="primitive-group">
					<li class="swatch bg-stone-50">50</li>
					<li class="swatch bg-stone-100">100</li>
					<li class="swatch bg-stone-200">200</li>
					<li class="swatch bg-stone-300">300</li>
					<li class="swatch bg-stone-400">400</li>
					<li class="swatch bg-stone-500">500</li>
					<li class="swatch bg-stone-600">600</li>
					<li class="swatch bg-stone-700">700</li>
					<li class="swatch bg-stone-800">800</li>
					<li class="swatch bg-stone-900">900</li>
					<li class="swatch primitive-base bg-stone">base</li>
				</ul>
			</section>
		</section>

		<section>
			<h2 class="tp-h2 font-medium">{t.semantic.title}</h2>
			<p class="mt-6">{t.semantic.description}</p>

			<section class="mt-[60px] max-w-full space-y-[60px] overflow-auto">
				<h3 class="tp-h3 font-medium">{t.semantic.brand.title}</h3>

				<div class="flex flex-wrap items-stretch gap-10">
					<ul class="flex flex-wrap gap-3">
						<li class="swatch-card">
							<div class="__color border bg-bg" />
							<div class="__description">
								<p>{t.semantic.brand.colors.background}</p>
								<p>base</p>
							</div>
						</li>
						<li class="swatch-card">
							<div class="__color bg-bg-100" />
							<div class="__description">
								<p>{t.semantic.brand.colors.background}</p>
								<p>100</p>
							</div>
						</li>
						<li class="swatch-card">
							<div class="__color bg-bg-200" />
							<div class="__description">
								<p>{t.semantic.brand.colors.background}</p>
								<p>200</p>
							</div>
						</li>
					</ul>

					<ul class="flex flex-wrap gap-3">
						<li class="swatch-card">
							<div class="__color bg-fg" />
							<div class="__description">
								<p>{t.semantic.brand.colors.foreground}</p>
								<p>base</p>
							</div>
						</li>
						<li class="swatch-card">
							<div class="__color bg-fg-100" />
							<div class="__description">
								<p>{t.semantic.brand.colors.foreground}</p>
								<p>100</p>
							</div>
						</li>
					</ul>

					<ul class="flex flex-wrap gap-3">
						<li class="swatch-card">
							<div class="__color bg-outline" />
							<div class="__description">
								<p>{t.semantic.brand.colors.outline}</p>
								<p>base</p>
							</div>
						</li>
						<li class="swatch-card">
							<div class="__color bg-outline-100" />
							<div class="__description">
								<p>{t.semantic.brand.colors.outline}</p>
								<p>100</p>
							</div>
						</li>
						<li class="swatch-card">
							<div class="__color bg-outline-200" />
							<div class="__description">
								<p>{t.semantic.brand.colors.outline}</p>
								<p>200</p>
							</div>
						</li>
					</ul>

					<div class="swatch-card">
						<div class="__color bg-link" />
						<div class="__description">
							<p>{t.semantic.brand.colors.link}</p>
						</div>
					</div>

					<div class="swatch-card">
						<div class="__color bg-neutral" />
						<div class="__description">
							<p>{t.semantic.brand.colors.neutral}</p>
						</div>
					</div>

					<div class="swatch-card">
						<div class="__color bg-gradient-to-t from-neutral to-transparent" />
						<div class="__description">
							<p>{t.semantic.brand.colors.gradient}</p>
						</div>
					</div>
				</div>
			</section>

			<section class="mt-[60px] max-w-full space-y-[60px] overflow-auto">
				<h3 class="tp-h3 font-medium">{t.semantic.status.title}</h3>
				<div class="max-w-full overflow-auto">
					<table class="status-colors w-full border-collapse">
						<thead>
							<tr>
								<th></th>
								<th scope="col">{t.semantic.common.surface}</th>
								<th scope="col">{t.semantic.common.details}</th>
								<th scope="col">{t.semantic.common.example}</th>
							</tr>
						</thead>
						<tbody>
							{#each STATUSES as status}
								<tr>
									<th scope="row">{t.semantic.status.colors[status]}</th>
									<td>
										<div class="flex flex-wrap items-center justify-center gap-2">
											<div class="swatch swatch--status {statusColorClasses[status].surface.base}">
												base
											</div>
											<div class="swatch swatch--status {statusColorClasses[status].surface[100]}">
												100
											</div>
											<div class="swatch swatch--status {statusColorClasses[status].surface[200]}">
												200
											</div>
										</div>
									</td>
									<td>
										<div class="flex flex-wrap items-center justify-center gap-2 text-sm">
											<p class="inline {statusColorClasses[status].text}">
												{t.semantic.common.text}
											</p>
											<div class="status-element {statusColorClasses[status].element}">
												{t.semantic.common.element}
											</div>
										</div>
									</td>
									<td>
										<BaseNotification intent={status}>
											<p>{t.semantic.status.notification}</p>
										</BaseNotification>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
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
		background: theme('colors.neutral.DEFAULT');
	}

	.swatch {
		padding: 24px;
		line-height: 1;
		text-align: center;
		border-radius: 4px;

		&.swatch--status {
			padding: 12px;
			font-size: theme('fontSize.sm');
		}
	}

	.primitive-group {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;

		margin-top: 40px;

		font-size: 18px;
		font-weight: theme('fontWeight.medium');
		line-height: 1;
		color: theme('colors.grayscale.black');
		text-align: center;

		@screen tb {
			grid-template-columns: repeat(5, 1fr);
		}

		@screen pc {
			grid-template-columns: repeat(10, 1fr);
		}

		:global(:where(& > *:nth-child(n + 7))) {
			color: theme('colors.grayscale.white');
		}

		:global(:where(& .primitive-base)) {
			grid-column: span 2;
			color: theme('colors.grayscale.white');

			@screen tb {
				grid-column: span 5;
			}

			@screen pc {
				grid-column: span 10;
			}
		}

		&.grayscale {
			@screen tb {
				grid-template-columns: repeat(6, 1fr);
			}

			@screen pc {
				grid-template-columns: repeat(11, 1fr);
			}

			:global(:where(& .primitive-base)) {
				/* grid-column: span 2; */

				@screen tb {
					grid-column: span 6;
				}

				@screen pc {
					grid-column: span 11;
				}
			}
		}
	}

	.swatch-card {
		display: flex;
		flex-direction: column;
		width: fit-content;
		border-radius: 4px;

		& .__color {
			width: 100%;
			min-width: 100px;
			height: 100px;
			border-radius: 4px 4px 0 0;
		}

		& .__description {
			flex: 1;
			padding: 12px;
			background-color: theme('colors.grayscale.200');
			border-radius: 0 0 4px 4px;

			& p {
				font-size: theme('fontSize.sm');
				line-height: 1;
				color: black;

				&:first-of-type {
					font-weight: theme('fontWeight.medium');
				}

				&:not(:first-of-type) {
					margin-block-start: 8px;
				}
			}
		}
	}

	.status-colors {
		& td,
		& th {
			padding: 8px;
			border-right: 1px solid theme('colors.outline.DEFAULT');
			border-bottom: 1px solid theme('colors.outline.DEFAULT');
			border-left: 1px solid theme('colors.outline.DEFAULT');

			&:first-child {
				border-left: none;
			}

			&:last-child {
				border-right: none;
			}

			tbody tr:last-child & {
				border-bottom: none;
			}
		}

		& th {
			font-weight: theme('fontWeight.medium');

			&[scope='row'] {
				text-align: left;
			}
		}

		& .status-element {
			display: inline-grid;
			place-items: center;

			width: 60px;
			height: 60px;

			font-size: theme('fontSize.xs');
			line-height: 1;
			color: theme('colors.grayscale.white');
			text-align: center;

			border-radius: 50%;

			@dark global {
				color: theme('colors.grayscale.black');
			}
		}
	}
</style>
