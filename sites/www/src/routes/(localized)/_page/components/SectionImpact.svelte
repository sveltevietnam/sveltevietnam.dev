<script lang="ts">
	import type { EmblaCarouselType } from 'embla-carousel';
	import embla from 'embla-carousel-svelte';

	import { AnimatedArrowCircle } from '$client/components/AnimatedArrowCircle';
	import { ConsecutiveFadeUpIntro } from '$client/components/ConsecutiveFadeUpIntro';
	import { SplitText } from '$client/components/SplitText';
	import { getLangContext } from '$client/contexts/lang';
	import { getNavigationContext } from '$client/contexts/navigation';
	import { intersect } from '$lib/actions/intersect';
	import type { Project } from '$shared/types';

	import { translations } from '../translation';

	export let projects: Project[];

	const { routes } = getNavigationContext();

	const langStore = getLangContext();
	$: lang = $langStore;

	$: t = translations[lang].impact;

	let emblaProgress = 0;
	let emblaApi: EmblaCarouselType;
	function onEmblaInit(event: CustomEvent<EmblaCarouselType>) {
		emblaApi = event.detail;
		emblaApi.on('scroll', () => {
			emblaProgress = emblaApi.scrollProgress() * 100;
		});
	}
</script>

<section class="impact">
	<div class="max-w-pad">
		<ConsecutiveFadeUpIntro selector=":is(.arrow, .char)">
			<a href={$routes.impact.path} title={t.title} class="section-title-container">
				<h2 class="c-text-h2 uppercase">
					<SplitText text={t.title} />
				</h2>
				<AnimatedArrowCircle
					class="arrow h-12 w-12 sp:self-start tb:h-16 tb:w-16"
					handle="parent"
				/>
			</a>
		</ConsecutiveFadeUpIntro>
		<p class="section-desc mt-6 pc:mt-8" use:intersect>{t.description}</p>
	</div>
	<div
		class="embla projects max-w-pad"
		use:intersect
		use:embla={{
			options: {
				loop: true,
				align: 'start',
				inViewThreshold: 0.5,
			},
			plugins: [],
		}}
		on:emblaInit={onEmblaInit}
	>
		<ul class="embla__container">
			{#each projects as { description, image, name, by, href }}
				<li class="project embla__slide">
					<div class="img-container">
						{#if image}
							<img src={image} alt={name} />
						{/if}
					</div>
					<div>
						<a class="c-link c-link--preserved c-text-h4 font-bold" {href}>{name}</a>
						<p class="description line-clamp-3 tb:line-clamp-4">{@html description}</p>
						<div class="by">
							<p class="whitespace-nowrap font-medium">{t.by}:</p>
							<p class="line-clamp-3 flex-1">{@html by}</p>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	</div>
	<div class="projects-pagination max-w-pad" use:intersect>
		<button class="pagination-btn mr-6" on:click={() => emblaApi?.scrollPrev()}>
			<svg
				inline-src="icon/caret"
				width="24"
				height="24"
				class="rotate-180 stroke-current stroke-2"
			/>
		</button>
		<p>01</p>
		<progress max="100" value={emblaProgress} />
		<p>{projects.length.toString().padStart(2, '0')}</p>
		<button class="pagination-btn ml-6" on:click={() => emblaApi?.scrollNext()}>
			<svg inline-src="icon/caret" width="24" height="24" class="stroke-current stroke-2" />
		</button>
	</div>
</section>

<style lang="postcss">
	.impact {
		margin-top: 80px;

		@screen tb {
			margin-top: 120px;
		}
	}

	.embla {
		overflow: hidden;
	}

	.embla__container {
		display: flex;
	}

	.embla__slide {
		flex: 0 0 100%;
		min-width: 0;
	}

	.projects {
		margin-top: 40px;
		padding-bottom: 10px;

		@screen tb {
			margin-top: 60px;
		}
	}

	.project {
		position: relative;

		overflow: hidden;
		display: flex;
		flex: 0 0 calc(83.2 * var(--container-max-width) / 100);
		flex-shrink: 0;
		align-items: flex-end;

		margin-left: 12px;
		padding: 40px 12px 12px;

		color: theme('colors.grayscale.white');

		border-top-left-radius: 40px;
		border-top-right-radius: 40px;

		@screen sp {
			height: 240px;
		}

		@screen tb {
			flex: 0 0 calc(60 * var(--container-max-width) / 100);
			margin-left: 20px;
			padding: 187px 24px 38px;
		}

		@screen pc {
			flex: 0 0 calc(46.25 * var(--container-max-width) / 100);
			margin-left: 32px;
		}
	}

	.img-container {
		--fallback-bg: #d9d9d9;

		@dark global {
			--fallback-bg: #1f1f1f;
		}

		position: absolute;
		z-index: -1;
		inset: 0;
		background: var(--fallback-bg);

		&::after {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(to bottom, rgb(0 0 0 / 0%) 50px, rgb(0 0 0 / 80%) 82.81%);

			@screen tb {
				background: linear-gradient(to bottom, rgb(0 0 0 / 0%) 200px, rgb(0 0 0 / 80%) 82.81%);
			}
		}

		& img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.description {
		margin-top: 8px;

		@screen tb {
			margin-top: 16px;
		}
	}

	.by {
		display: flex;
		gap: 16px;
		align-items: center;
		margin-top: 8px;

		@screen sp {
			align-items: flex-start;
		}

		@screen tb {
			margin-top: 10px;
		}
	}

	.projects-pagination {
		display: flex;
		gap: 8px;
		align-items: center;
		justify-content: flex-end;

		margin-top: 30px;

		@screen tb {
			margin-top: 70px;
		}
	}

	.pagination-btn {
		padding: 10px;

		opacity: 0.5;
		border: 2px solid currentcolor;
		border-radius: theme('borderRadius.full');

		transition: opacity theme('transitionTimingFunction.DEFAULT') 250ms;

		&:hover {
			opacity: 1;
		}
	}

	progress {
		width: 80px;
		height: 2px;
		appearance: none;
		background-color: theme('colors.outline.DEFAULT');

		&::-webkit-progress-bar {
			background-color: theme('colors.outline.DEFAULT');
		}

		&::-moz-progress-bar {
			background-color: theme('colors.fg.DEFAULT');
		}

		&::-webkit-progress-value {
			background-color: theme('colors.fg.DEFAULT');
		}

		@screen tb {
			width: 120px;
		}
	}
</style>
