<script lang="ts">
	import { getLangContext } from '$client/contexts/lang';
	import { intersect } from '$lib/actions/intersect';
	import { ConsecutiveFadeUpIntro } from '$lib/components/ConsecutiveFadeUpIntro';
	import { SplitText } from '$lib/components/SplitText';
	import { SOCIAL_LINKS } from '$lib/constants';

	import { translations } from '../translation';

	const langStore = getLangContext();
	$: lang = $langStore;

	$: t = translations[lang].community;
</script>

<section class="community max-w-pad" id="community">
	<h2 class="section-title c-text-h2 uppercase">
		<ConsecutiveFadeUpIntro selector=".char" class="inline-block">
			<SplitText text={t.title} />
		</ConsecutiveFadeUpIntro>
	</h2>
	<p class="section-desc c-intersect mt-6" use:intersect>
		{@html t.description}
	</p>
	<ul class="ctas c-intersect divide-y divide-outline" use:intersect>
		<li>
			<a class="c-link c-link--box font-medium" href="https://learn.sveltevietnam.dev" external>
				<span>{t.ctas.learn}</span>
			</a>
		</li>
		<li>
			<a class="c-link c-link--box font-medium" href={SOCIAL_LINKS.DISCORD} external>
				<span>{t.ctas.discord}</span>
			</a>
		</li>
		<!-- <li>
      <a class="c-link c-link--box font-medium" href={$routes.people.path}>
        <span>{t.ctas.nominate}</span>
      </a>
    </li> -->
		<li>
			<a class="c-link c-link--box font-medium" href={SOCIAL_LINKS.GITHUB} external>
				<span>{t.ctas.contribute}</span>
			</a>
		</li>
	</ul>
</section>

<style lang="postcss">
	.community {
		--padding-top: 80px;
		--padding-bottom: 80px;
		--gradient-top-height: 100px;
		--gradient-bottom-height: 130px;

		position: relative;
		z-index: 1;
		padding-top: var(--padding-top);
		padding-bottom: var(--padding-bottom);

		&::before {
			pointer-events: none;
			content: '';

			position: absolute;
			z-index: -1;
			top: calc(var(--padding-top) - var(--gradient-top-height));
			right: 0;
			bottom: calc(var(--padding-bottom) - var(--gradient-bottom-height));
			left: 0;

			background-image: linear-gradient(
				to bottom,
				transparent,
				theme('colors.neutral.DEFAULT') var(--gradient-top-height),
				theme('colors.neutral.DEFAULT') calc(100% - var(--gradient-bottom-height)),
				transparent
			);
		}

		@screen tb {
			--padding-top: 160px;
			--gradient-top-height: 220px;
			--gradient-bottom-height: 360px;
		}

		@screen pc {
			--gradient-top-height: 300px;
		}
	}

	.section-title {
		grid-area: title;
	}

	.section-desc {
		grid-area: description;

		@screen sp {
			margin-top: 24px;
		}
	}

	.ctas {
		grid-area: ctas;
		margin-top: 30px;

		@screen tb {
			max-width: 548px;
			margin-top: 60px;
		}
	}
</style>
