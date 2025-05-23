<script lang="ts">
	import { StackItem } from '@svelte-put/async-stack';
	import { T } from '@sveltevietnam/i18n';

	import * as m from '$data/locales/generated/messages';
	import { BlogPostListItem } from '$lib/components/blog-post-list-item';
	import { Breadcrumbs } from '$lib/components/breadcrumbs';
	import { IntroSeparator } from '$lib/components/intro-separator';
	import { STATUSES } from '$lib/constants';
	import BaseNotification from '$lib/notifications/components/BaseNotification.svelte';
	import { RoutingContext } from '$lib/routing/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	import type { PageData } from './$types';
	import { colors } from './_page/colors';
	import imgNonLa from './_page/images/non-la.jpg?format=avif';
	import imgRays from './_page/images/rays.jpg?format=avif';

	let { data }: { data: PageData } = $props();

	const settings = SettingsContext.get();

	const MARK_CLASSES = {
		info: 'text-info-on-surface bg-info-surface',
		success: 'text-success-on-surface bg-success-surface',
		warning: 'text-warning-on-surface bg-warning-surface',
		error: 'text-error-on-surface bg-error-surface',
	};
	const CALLOUT_CLASSES = {
		info: 'c-callout--info',
		success: 'c-callout--success',
		warning: 'c-callout--warning',
		error: 'c-callout--error',
	};

	const routing = RoutingContext.get();
	let status = $state<App.Status>('info');
	let [markCls, calloutCls] = $derived([MARK_CLASSES[status], CALLOUT_CLASSES[status]]);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const item = new StackItem({ id: 'sample', timeout: 0, variant: 'custom' } as any);
</script>

<main>
	<!-- intro -->
	<section class="space-y-section pt-intro-pad-top bg-gradient-primary-intro">
		<div class="max-w-pad tablet:space-y-8 space-y-6">
			<Breadcrumbs crumbs={routing.breadcrumbs} />
			<div class="space-y-4">
				<h1 class="c-text-heading-page text-primary-on-surface">
					<T message={m['pages.design.heading']} />
				</h1>
				<p class="c-text-subtitle-page">
					<T message={m['pages.design.desc']} />
				</p>
			</div>
		</div>
		<IntroSeparator />
	</section>

	<!-- typography  -->
	<section class="max-w-pad py-section space-y-10">
		<h2 class="c-text-heading-lg border-b">
			<T message={m['pages.design.typography.heading']} />
		</h2>
		<table class="border-outline w-full border-collapse border">
			<thead>
				<tr class="bg-surface-variant text-left *:w-1/2 *:border *:px-3 *:py-2">
					<th scope="col"><T message={m['pages.design.typography.headers.example']} /></th>
					<th scope="col"><T message={m['pages.design.typography.headers.desc']} /></th>
				</tr>
			</thead>
			<tbody>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<span class="c-text-heading-page text-primary-on-surface">
							<T message={m['pages.design.typography.rows.heading_page.title']} />
						</span>
					</td>
					<td><T message={m['pages.design.typography.rows.heading_page.desc']} /></td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<span class="c-text-heading-lg">
							<T message={m['pages.design.typography.rows.heading_large.title']} />
						</span>
					</td>
					<td><T message={m['pages.design.typography.rows.heading_large.desc']} /></td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<span class="c-text-heading-md">
							<T message={m['pages.design.typography.rows.heading_medium.title']} />
						</span>
					</td>
					<td><T message={m['pages.design.typography.rows.heading_medium.desc']} /></td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<span class="c-text-heading">
							<T message={m['pages.design.typography.rows.heading.title']} />
						</span>
					</td>
					<td><T message={m['pages.design.typography.rows.heading.desc']} /></td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<span class="c-text-title">
							<T message={m['pages.design.typography.rows.title.title']} />
						</span>
					</td>
					<td><T message={m['pages.design.typography.rows.title.desc']} /></td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<span class="c-text-subtitle-page">
							<T message={m['pages.design.typography.rows.page_subtitle.title']} />
						</span>
					</td>
					<td><T message={m['pages.design.typography.rows.page_subtitle.desc']} /></td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<span class="c-text-body-md">
							<T message={m['pages.design.typography.rows.body_medium.title']} />
						</span>
					</td>
					<td><T message={m['pages.design.typography.rows.body_medium.desc']} /></td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<span class="c-text-body">
							<T message={m['pages.design.typography.rows.body.title']} />
						</span>
					</td>
					<td><T message={m['pages.design.typography.rows.body.desc']} /></td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<span class="c-text-body-sm">
							<T message={m['pages.design.typography.rows.body_small.title']} />
						</span>
					</td>
					<td><T message={m['pages.design.typography.rows.body_small.desc']} /></td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<span class="c-text-body-xs">
							<T message={m['pages.design.typography.rows.body_smaller.title']} />
						</span>
					</td>
					<td><T message={m['pages.design.typography.rows.body_smaller.desc']} /></td>
				</tr>
			</tbody>
		</table>
	</section>

	<!-- Sand color palette -->
	<section class="max-w-pad py-section space-y-6">
		<h2 class="c-text-heading-lg border-b">
			<T message={m['pages.design.sand.heading']} />
		</h2>
		<p>
			<T message={m['pages.design.sand.desc']} />
		</p>
		<ul class="mobile:justify-center flex flex-wrap">
			{#each colors as color (color.code)}
				<li
					class={[
						'w-50 mobile relative space-y-1 py-6 text-center',
						color.code > 500 ? 'text-sand-50' : 'text-sand-950',
						color.class,
					]}
				>
					{#if color.p3}
						<p
							class="c-text-body-xs border-onehalf absolute right-2 top-2 border-current px-2 py-0.5 font-bold"
						>
							P3
						</p>
					{/if}
					<p class="c-text-body-sm">sand-{color.code}</p>
					<div>
						<p class="font-lora text-4xl font-bold leading-none">{color.apca.value}</p>
						<p class="c-text-body-xs">
							to <strong>{color.apca.to}</strong>
						</p>
					</div>
					<p class="c-text-body-sm underline">{color.oklch}</p>
				</li>
			{/each}
		</ul>
		<p class="c-text-body-sm italic">
			<T message={m['pages.design.sand.footnote']} />
		</p>
	</section>

	<!-- Semantic colors -->
	<section class="max-w-pad space-y-10">
		<div class="space-y-6">
			<h2 class="c-text-heading-lg border-b">
				<T message={m['pages.design.colors.semantic.heading']} />
			</h2>
			<p><T message={m['pages.design.colors.semantic.desc']} /></p>
		</div>

		{#snippet annotationMarker(num: number, cls: string)}
			<div class={['flex flex-col items-center', cls]}>
				<p class="text-surface bg-on-surface grid h-6 w-6 place-items-center rounded-full">{num}</p>
				<svg class="h-9 w-3" viewBox="0 0 12 36" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="6" cy="30" r="5.5" stroke="currentcolor" />
					<path d="M6 24.5V0" stroke="currentcolor" />
				</svg>
			</div>
		{/snippet}

		{#snippet annotationDescription(num: number, text: string)}
			<li class="flex items-center gap-3">
				<p class="text-surface bg-on-surface grid h-6 w-6 place-items-center rounded-full">{num}</p>
				<p>{text}</p>
			</li>
		{/snippet}

		<!-- Basic colors -->
		<section class="space-y-6">
			<h3 class="c-text-heading-md border-b font-normal">
				<T message={m['pages.design.colors.basic.heading']} />
			</h3>
			<p><T message={m['pages.design.colors.basic.desc']} /></p>
			<div class="space-y-6">
				<div class="_texture tablet:p-10 desktop:p-20 overflow-auto border p-6">
					<div
						class="border-onehalf shadow-brutal w-133 min-w-133 bg-surface relative mx-auto border-current p-6"
					>
						<BlogPostListItem post={data.sampleBlogPost} />
						{@render annotationMarker(1, 'absolute bottom-1/4 right-6')}
						{@render annotationMarker(2, 'absolute bottom-1/6 right-32')}
						{@render annotationMarker(3, 'absolute bottom-6 left-4')}
						{@render annotationMarker(4, 'absolute bottom-8 left-50')}
					</div>
				</div>
				<ul class="flex flex-wrap gap-x-8 gap-y-4">
					{@render annotationDescription(1, '--color-surface')}
					{@render annotationDescription(2, '--color-on-surface')}
					{@render annotationDescription(3, '--color-outline')}
					{@render annotationDescription(4, '--color-on-surface-subtle')}
				</ul>
			</div>
		</section>

		<!-- Basic colors -->
		<section class="space-y-6">
			<h3 class="c-text-heading-md border-b font-normal">
				<T message={m['pages.design.colors.status.heading']} />
			</h3>
			<p><T message={m['pages.design.colors.status.desc']} /></p>
			<div class="space-y-6">
				<div>
					<div class="relative flex translate-y-px justify-end">
						{#each STATUSES as value (value)}
							<label
								class="has-checked:text-on-surface text-on-surface-subtle _texture not-has-checked:bg-none! has-checked:border-b-surface has-checked:border-outline
								has-checked:border-b-2 tablet:px-6 cursor-pointer border border-transparent px-4 pb-1.5 pt-2"
							>
								<input class="sr-only" type="radio" name="status" {value} bind:group={status} />
								<span class="capitalize">{value}</span>
							</label>
						{/each}
					</div>
					<div class="_texture tablet:p-10 desktop:p-20 overflow-auto border p-6">
						<div
							class="border-onehalf shadow-brutal w-180 min-w-180 bg-surface relative mx-auto border-current p-6"
						>
							<div class="space-y-6">
								<p class="font-lora text-5xl font-normal capitalize leading-normal">{status}</p>
								<p><T message={m['pages.design.colors.status.sample.desc']} cls={markCls} /></p>
								<p class="c-callout {calloutCls}">
									<T message={m['pages.design.colors.status.sample.callout']} />
								</p>
								<BaseNotification
									class="_noti"
									title={m['pages.design.colors.status.sample.notification.title']}
									{status}
									{item}
								>
									<p><T message={m['pages.design.colors.status.sample.notification.desc']} /></p>
								</BaseNotification>
							</div>
							{@render annotationMarker(1, 'absolute top-32 right-1/3')}
							{@render annotationMarker(2, 'absolute top-42 right-16')}
							{@render annotationMarker(3, 'absolute bottom-5 right-2/5')}
						</div>
					</div>
				</div>
				<ul class="flex flex-wrap gap-x-8 gap-y-4">
					{@render annotationDescription(1, `--color-${status}-surface`)}
					{@render annotationDescription(2, `--color-${status}-on-surface`)}
					{@render annotationDescription(3, `--color-${status}-on-surface-subtle`)}
				</ul>
			</div>
		</section>
	</section>

	<!-- Logo -->
	<section class="max-w-pad py-section space-y-10">
		<div class="space-y-6">
			<h2 class="c-text-heading-lg border-b">Logo</h2>
			<p>
				<T message={m['pages.design.logo.desc']} />
			</p>
			<p class="c-callout c-callout--success c-callout--icon-trophy">
				<T message={m['pages.design.logo.credit']} />
			</p>
		</div>

		<!-- Inspiration -->
		<section class="space-y-6">
			<h3 class="c-text-heading-md border-b font-normal">
				<T message={m['pages.design.logo.inspiration.heading']} />
			</h3>
			<p>
				<i class="i i-sveltevietnam text-svelte float-right h-20 w-20"></i>
				<T message={m['pages.design.logo.inspiration.desc']} />
			</p>
			<div class="tablet:grid-cols-[auto_auto_auto] grid w-fit grid-cols-2 gap-6">
				<img
					class="h-auto w-44"
					src={imgRays}
					alt={m['pages.design.logo.alt.rays'](settings.language)}
					width="177"
					height="264"
					fetchpriority="low"
					loading="lazy"
					decoding="async"
				/>
				<div class="tablet:w-fit flex w-full flex-col gap-6 text-center">
					<p class="tablet:p-6 border border-current px-2 py-4">
						<T message={m['pages.design.logo.inspire']} />
					</p>
					<p class="tablet:p-6 border border-current px-2 py-4">
						<T message={m['pages.design.logo.community']} />
					</p>
					<p class="tablet:p-6 border border-current px-2 py-4"><T message={m['vietnam']} /></p>
				</div>
				<div
					class="mobile:grid-rows-subgrid tablet:grid-cols-1 mobile:col-span-2 grid grid-cols-2 justify-between gap-6"
				>
					<div class="i i-[simple-icons--svelte] w-30 h-30 text-svelte shrink-0"></div>
					<img
						class="w-37 h-auto"
						src={imgNonLa}
						alt={m['pages.design.logo.alt.non_la'](settings.language)}
						width="148"
						height="121"
						fetchpriority="low"
						loading="lazy"
						decoding="async"
					/>
				</div>
			</div>
		</section>

		<!-- Variants -->
		<section class="space-y-8">
			<h3 class="c-text-heading-md border-b font-normal">
				<T message={m['pages.design.logo.variants.heading']} />
			</h3>
			<ul class="mobile:justify-center flex flex-wrap gap-x-10 gap-y-6">
				<li class="w-fit space-y-2">
					<div class="bg-sand-50 text-svelte flex items-center gap-3 border border-b px-5 py-4">
						<div class="i i-sveltevietnam h-18 w-18"></div>
						<p class="c-text-title-sm max-w-25 uppercase">
							<T message={m['svelte_vietnam.name']} />
						</p>
					</div>
					<p><T message={m['pages.design.logo.variants.original']} /></p>
				</li>
				<li class="w-fit space-y-2">
					<div class="bg-sand-50 text-sand-950 flex items-center gap-3 border border-b px-5 py-4">
						<div class="i i-sveltevietnam h-18 w-18"></div>
						<p class="c-text-title-sm max-w-25 uppercase">
							<T message={m['svelte_vietnam.name']} />
						</p>
					</div>
					<p><T message={m['pages.design.logo.variants.positive']} /></p>
				</li>
				<li class="w-fit space-y-2">
					<div class="bg-sand-950 text-sand-50 flex items-center gap-3 border border-b px-5 py-4">
						<div class="i i-sveltevietnam h-18 w-18"></div>
						<p class="c-text-title-sm max-w-25 uppercase">
							<T message={m['svelte_vietnam.name']} />
						</p>
					</div>
					<p><T message={m['pages.design.logo.variants.negative']} /></p>
				</li>
			</ul>
		</section>
	</section>
</main>

<style lang="postcss">
	._texture {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.2' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
		background-repeat: repeat;
		background-size: 10px 10px;
	}

	main {
		& :global(._noti .progress) {
			width: 65%;
		}
	}
</style>
