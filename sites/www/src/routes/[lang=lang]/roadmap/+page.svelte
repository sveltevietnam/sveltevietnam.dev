<script lang="ts">
	import { intersect } from '$client/actions/intersect';
	import { Breadcrumbs } from '$client/components/Breadcrumbs';
	import { ConsecutiveFadeUpIntro } from '$client/components/ConsecutiveFadeUpIntro';
	import { SplitText } from '$client/components/SplitText';

	import type { PageData } from './$types';

	export let data: PageData;

	$: t = data.translations.page;
</script>

<main class="max-w-pad">
	<div class="mt-6" use:intersect>
		<Breadcrumbs breadcrumbs={data.breadcrumbs} />
	</div>
	<section class="mt-8 flex items-start justify-between gap-8 upto-tb:flex-col tb:mt-[60px]">
		<div use:intersect>
			<h1 class="c-text-h1 font-medium uppercase">{t.title}</h1>
			<p class="c-text-h4 mt-6 tb:mt-8">{t.subtitle}</p>
		</div>
		<div use:intersect>
			<svg
				inline-src="./_page/images/key-visuals"
				class="opacity-5 upto-tb:h-auto upto-tb:w-full"
			/>
		</div>
	</section>

	<div class="space-y-[60px] py-[60px] tb:space-y-[120px] tb:pb-[200px] tb:pt-[120px]">
		<section class="relative">
			<div class="space-y-6">
				<ConsecutiveFadeUpIntro selector=".char">
					<h2 class="c-text-h2 font-medium uppercase">
						<SplitText text={`${t.common.milestone}: ${t.milestones.aulac.title}`} />
					</h2>
				</ConsecutiveFadeUpIntro>
				<p use:intersect>
					<strong class="font-medium">{t.common.objective}</strong>: {t.milestones.aulac.objective}
				</p>
				<div>
					<p class="font-medium" use:intersect>{t.common.tasks}:</p>
					<ul class="ml-3 mt-3 space-y-3">
						{#each t.milestones.aulac.primaryTasks as task}
							<li use:intersect>
								{@html task}
							</li>
						{/each}
					</ul>
				</div>
			</div>
			<div use:intersect class="absolute right-0 top-0 -z-px">
				<svg
					inline-src="./_page/images/au-lac"
					class="opacity-[2%] upto-tb:top-[100px] upto-tb:h-auto upto-tb:w-full"
				/>
			</div>
		</section>

		<section class="relative">
			<div class="space-y-6">
				<ConsecutiveFadeUpIntro selector=".char">
					<h2 class="c-text-h2 font-medium uppercase">
						<SplitText text={`${t.common.milestone}: ${t.milestones.tu.title}`} />
					</h2>
				</ConsecutiveFadeUpIntro>
				<p use:intersect>
					<strong class="font-medium">{t.common.objective}</strong>: {t.milestones.tu.objective}
				</p>
				<div>
					<p class="font-medium" use:intersect>{t.common.tasks}:</p>
					<ul class="ml-3 mt-3 space-y-3">
						{#each t.milestones.tu.primaryTasks as task}
							<li use:intersect>
								{@html task}
							</li>
						{/each}
					</ul>
				</div>
				<div>
					<p use:intersect>
						<strong class="font-medium">{t.milestones.tu.secondaryTasks.title}:</strong>
					</p>
					<ul class="ml-3 mt-3 space-y-3">
						{#each t.milestones.tu.secondaryTasks.items as task}
							<li use:intersect>
								{@html task}
							</li>
						{/each}
					</ul>
				</div>
			</div>
			<div class="absolute bottom-0 right-0 -z-px" use:intersect>
				<div class="flex items-center gap-10 opacity-[2%] upto-tb:max-h-full upto-tb:flex-col">
					<p class="sr-only">Chữ Nôm</p>
					<svg inline-src="./_page/images/tu_chu.svg" />
					<svg inline-src="./_page/images/tu_nom.svg" />
				</div>
			</div>
		</section>

		<section class="relative">
			<div class="space-y-6">
				<ConsecutiveFadeUpIntro selector=".char">
					<h2 class="c-text-h2 font-medium uppercase">
						<SplitText text={`${t.common.milestone}: ${t.milestones.dong.title}`} />
					</h2>
				</ConsecutiveFadeUpIntro>
				<p use:intersect>
					<strong class="font-medium">{t.common.objective}</strong>: {t.milestones.dong.objective}
				</p>
				<div>
					<p class="font-medium" use:intersect>{t.common.tasks}:</p>
					<ul class="ml-3 mt-3 space-y-3">
						{#each t.milestones.dong.primaryTasks as task}
							<li use:intersect>
								{@html task}
							</li>
						{/each}
					</ul>
				</div>
			</div>
			<div class="absolute bottom-0 right-0 -z-px" use:intersect>
				<p class="sr-only">Đồng Thiên Phúc trấn bảo</p>
				<svg inline-src="./_page/images/dong" class="max-h-full opacity-[2%]" />
			</div>
		</section>
	</div>
</main>
