<script lang="ts">
	import { Breadcrumbs } from '$lib/components/Breadcrumbs';
	import { getRoutingContext } from '$lib/routing/routing.context';

	import type { PageData } from './$types';

	export let data: PageData;

	const { routes } = getRoutingContext();

	$: t = data.translations.page;
</script>

<main class="c-text-body1">
	<div class="heading-container max-w-pad">
		<Breadcrumbs breadcrumbs={data.breadcrumbs} class="mb-10" />
		<h1 class="c-text-h1 font-medium uppercase">{t.title}</h1>
	</div>

	<div
		class="max-w-pad overflow-auto pb-48 pt-20"
		style:--events-length={data.events.length}
		style:--posts-length={data.posts.length}
		style:--branch-right-height="42px"
	>
		<div class="w-fit">
			<section class="site-section home">
				<div class="row-span-2">
					<a class="card card--lg" href={$routes.home.path}>
						<svg inline-src="lucide/home" width="24" height="24" stroke-width="2" />
						<h2 class="c-text-h3 font-medium">{$routes.home.label}</h2>
					</a>
				</div>
				<div class="subpages home-first">
					{#each [$routes.jobs, $routes.sponsor, $routes.roadmap] as { path, label }}
						<div class="branch-down">
							<svg inline-src="./_page/images/branch-down.svg" width="27" height="76" />
							<a href={path} class="c-link c-link--preserved c-text-h5">{label}</a>
						</div>
					{/each}
				</div>
				<div class="subpages home-second">
					{#each [$routes.codeOfConduct, $routes.settings] as { path, label }}
						<div class="branch-down">
							<svg inline-src="./_page/images/branch-down.svg" width="27" height="76" />
							<a href={path} class="c-link c-link--preserved c-text-h5">{label}</a>
						</div>
					{/each}
				</div>
			</section>

			<div class="nested-pages-wrapper space-y-16">
				<section class="site-section">
					<div class="branch-right">
						<svg inline-src="./_page/images/branch-right.svg" width="76" height="38" />
						<a class="card" href={$routes.design.path}>
							<svg inline-src="lucide/paint-roller" width="24" height="24" stroke-width="2" />
							<h3 class="c-text-h4 font-medium">{$routes.design.label}</h3>
						</a>
					</div>
					<div class="subpages design">
						{#each [$routes.design_typography, $routes.design_colors, $routes.design_blog] as { path, label }}
							<div class="branch-down">
								<svg inline-src="./_page/images/branch-down.svg" width="27" height="76" />
								<a href={path} class="c-link c-link--preserved c-text-h5">{label}</a>
							</div>
						{/each}
					</div>
				</section>

				<section class="site-section">
					<div class="branch-right">
						<svg inline-src="./_page/images/branch-right.svg" width="76" height="38" />
						<a class="card" href={$routes.events.path}>
							<svg inline-src="lucide/users" width="24" height="24" stroke-width="2" />
							<h3 class="c-text-h4 font-medium">{$routes.events.label}</h3>
						</a>
					</div>
					<div class="leaves events">
						<svg
							inline-src="./_page/images/l-right-down.svg"
							width="64"
							height="85"
							class="shrink-0"
						/>
						<ul>
							{#each data.events as { title, slug }}
								<li>
									<svg inline-src="./_page/images/branch-right.svg" width="76" height="38" />
									<a
										class="c-link c-link--preserved whitespace-nowrap"
										href="{$routes.events.path}/{slug}">{title}</a
									>
								</li>
							{/each}
						</ul>
					</div>
				</section>

				<section class="site-section">
					<div class="branch-right">
						<svg inline-src="./_page/images/branch-right.svg" width="76" height="38" />
						<a class="card" href={$routes.blog.path}>
							<svg inline-src="lucide/pencil" width="24" height="24" stroke-width="2" />
							<h3 class="c-text-h4 font-medium">{$routes.blog.label}</h3>
						</a>
					</div>
					<div class="leaves posts">
						<svg
							inline-src="./_page/images/l-right-down.svg"
							width="64"
							height="85"
							class="shrink-0"
						/>
						<ul>
							{#each data.posts as { title, slug }}
								<li>
									<svg inline-src="./_page/images/branch-right.svg" width="76" height="38" />
									<a
										class="c-link c-link--preserved whitespace-nowrap"
										href="{$routes.blog.path}/{slug}">{title}</a
									>
								</li>
							{/each}
						</ul>
					</div>
				</section>
			</div>
		</div>
		<a class="c-btn w-fit" href="/sitemap.xml">{t.xml}</a>
	</div>
</main>

<style lang="postcss">
	.heading-container {
		margin-top: calc(-1 * theme('spacing.header'));
		padding-top: calc(theme('spacing.header') + 20px);
		padding-bottom: 80px;
		background: theme('colors.neutral.DEFAULT');
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 32px;

		width: 132px;
		height: fit-content;
		padding: 24px;

		color: theme('colors.grayscale.white');

		background-color: theme('colors.zinc.500');
		border-radius: 16px;

		transition: background-color 250ms ease-out;

		&.card--lg {
			gap: 64px;
			width: 180px;
			padding: 24px 32px;
			border-radius: 24px;
		}

		&:hover {
			background-color: theme('colors.link.DEFAULT');
		}

		:global(html[lang='vi']) & {
			width: 142px;

			&.card--lg {
				width: 172px;

				@screen tb {
					width: 200px;
				}
			}
		}

		& svg {
			color: theme('colors.grayscale.white');
		}
	}

	svg {
		color: theme('colors.zinc.500');
	}

	.branch-down {
		display: flex;
		gap: 14px;
		align-items: flex-end;

		& svg {
			margin-bottom: 4px;
		}
	}

	.branch-right {
		display: flex;
		gap: 16px;
	}

	.site-section {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-rows: 1fr;

		&.home {
			grid-template-rows: auto auto;
			row-gap: 40px;
		}
	}

	.subpages {
		position: relative;

		display: flex;
		gap: 40px;
		align-items: flex-start;

		width: fit-content;
		padding-left: 80px;

		&::before {
			content: '';

			position: absolute;
			z-index: -1;
			top: 0;
			left: 0;

			height: 4px;

			background-color: theme('colors.zinc.500');
		}

		&.home-first {
			padding-top: 24.5px;

			&::before {
				top: 24.5px;
				width: 354px;

				:global(html[lang='vi']) & {
					width: 370px;
				}
			}
		}

		&.home-second {
			&::before {
				width: 308px;

				:global(html[lang='vi']) & {
					width: 292px;
				}
			}
		}

		&.design {
			padding-top: 24px;

			&::before {
				top: 24px;
				width: 400px;

				:global(html[lang='vi']) & {
					width: 386px;
				}
			}
		}
	}

	.nested-pages-wrapper {
		position: relative;
		padding: 60px 32px;

		&::before {
			--height: 522px;

			content: '';

			position: absolute;
			z-index: -1;
			top: -48px;
			left: 32px;

			width: 4px;
			height: calc(var(--height) + (var(--events-length) - 2) * var(--branch-right-height));

			background-color: theme('colors.zinc.500');

			:global(html[lang='vi']) & {
				--height: 484px;

				top: -18px;

				@screen tb {
					--height: 480px;

					top: -8px;
				}
			}
		}
	}

	.leaves {
		display: flex;
		align-items: flex-start;
		margin-left: -2px;
		padding-top: 24px;

		&.events {
			--items-length: var(--events-length);
		}

		&.posts {
			--items-length: var(--posts-length);
		}

		& ul {
			position: relative;
			margin-left: -4px;
			padding-top: 40px;

			&::before {
				--height: 44px;

				content: '';

				position: absolute;
				z-index: -1;
				top: 40px;

				width: 4px;
				height: calc(var(--height) + (var(--items-length) - 2) * var(--branch-right-height));

				background-color: theme('colors.zinc.500');
			}
		}

		& li {
			display: flex;
			gap: 16px;
			align-items: flex-end;

			& svg {
				flex-shrink: 0;
				margin-bottom: 4px;
			}
		}
	}
</style>
