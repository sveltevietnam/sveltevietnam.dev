<script lang="ts">
	import { intersect } from '$client/actions/intersect';
	import { Breadcrumbs } from '$client/components/Breadcrumbs';
	import { ConsecutiveFadeUpIntro } from '$client/components/ConsecutiveFadeUpIntro';
	import { SplitText } from '$client/components/SplitText';
	import { EMAILS, SOCIAL_LINKS } from '$shared/constants';

	import type { PageData } from './$types';

	export let data: PageData;

	$: t = data.translations.page;
</script>

<main class="max-w-pad">
	<div class="mt-6" use:intersect>
		<Breadcrumbs breadcrumbs={data.breadcrumbs} />
	</div>

	<section class="mt-8 tb:mt-[60px]">
		<h1 class="tp-h1 font-medium uppercase" use:intersect>{t.title}</h1>
	</section>

	<div class="space-y-[60px] py-[60px] tb:space-y-[120px] tb:pb-[200px] tb:pt-[120px]">
		<section use:intersect>
			<h2 class="sr-only">{t.notice.title}</h2>
			<div class="space-y-4">
				<p>{@html t.notice.description}</p>
				<p>{@html t.notice.action}</p>
				<ul class="divider-border mt-4 max-w-[548px] divide-y font-medium" use:intersect>
					<li>
						<a href={SOCIAL_LINKS.DISCORD} class="c-link c-link--box" external>
							<span>{t.notice.ctas.discord}</span>
							<svg inline-src="icon/external-link" />
						</a>
					</li>
					<li>
						<a class="c-link c-link--box" href="mailto:{EMAILS.COC}" external>
							<span>Email {EMAILS.COC}</span>
							<svg inline-src="icon/external-link" />
						</a>
					</li>
				</ul>
			</div>
		</section>

		<section>
			<ConsecutiveFadeUpIntro selector=".char">
				<h2 class="tp-h2 font-medium uppercase">
					<SplitText text={t.excerpt.title} />
				</h2>
			</ConsecutiveFadeUpIntro>
			<p class="mt-6" use:intersect>{@html t.excerpt.intro}</p>
			<div class="relative mt-10 tb:mt-[60px] tb:pl-[140px] tb:pr-[48px]" use:intersect>
				<blockquote cite="https://sveltesociety.dev/about">
					<div aria-disabled class="left-[95px] top-[-18px] flex gap-0.5 upto-tb:mb-3 tb:absolute">
						<svg inline-src="icon/quote-open" width="16" height="30" />
						<svg class="text-fg-200" inline-src="icon/quote-open" width="16" height="30" />
					</div>
					<p>{@html t.excerpt.quote}</p>
					<div
						aria-disabled
						class="bottom-6 right-0 flex w-fit gap-0.5 upto-tb:ml-auto upto-tb:mt-3 tb:absolute"
					>
						<svg class="text-fg-200" inline-src="icon/quote-close" width="16" height="30" />
						<svg inline-src="icon/quote-close" width="16" height="30" />
					</div>
					<footer class="mt-5 text-fg-200">
						<cite class="not-italic">{@html t.excerpt.caption}</cite>
					</footer>
				</blockquote>
			</div>
		</section>
	</div>
</main>
