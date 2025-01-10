<script lang="ts">
	import { Toc } from '@svelte-put/toc';
	import { T } from '@sveltevietnam/i18n';

	import { page } from '$app/state';
	import fallback16x9 from '$lib/assets/images/fallbacks/16x9.jpg?enhanced&w=2240,1540;1088;686&imagetools';
	import { Avatar } from '$lib/components/avatar';
	import { BlogPostListItem } from '$lib/components/blog-post-list-item';
	import { Breadcrumbs } from '$lib/components/breadcrumbs';
	import { CopyIconBtn } from '$lib/components/copy-icon-btn';
	import { HintedText } from '$lib/components/hinted-text';
	import { NotByAiBadge } from '$lib/components/not-by-ai-badge';
	import { DialogContext } from '$lib/dialogs/context.svelte.js';
	import { QrCodeDialog } from '$lib/dialogs/qr-code-dialog/index.js';
	import { RoutingContext } from '$lib/routing/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	let { data } = $props();

	const routing = RoutingContext.get();
	const settings = SettingsContext.get();
	const dialog = DialogContext.get();

	let locales = $derived(data.locales.page as import('./_page/locales/generated').Locale);

	let dateFormatter = $derived(
		new Intl.DateTimeFormat(settings.language, {
			year: 'numeric',
			month: 'long',
		}),
	);

	const thumbnail = $derived(data.post.thumbnail || fallback16x9);
	const url = $derived(page.url.origin + data.routing.paths[settings.language].path);
	const encodedUrl = $derived(encodeURIComponent(url));

	const toc = new Toc({
		selector: ':where(h2, h3, h4, h5, h6)',
		observe: {
			enabled: true,
			link: {
				activeAttribute: 'data-current',
			},
		},
	});

	function openQrDialog() {
		dialog.push('custom', {
			component: QrCodeDialog,
			props: {
				data: url,
				locales: {
					title: locales.qr_title,
					description: locales.qr_description,
					download: locales.qr_download,
					close: locales.qr_close,
				},
			},
		});
	}
</script>

<main>
	<!-- intro -->
	<section
		class="pt-intro-pad-top max-w-pad from-32% from-primary-surface to-surface bg-gradient-to-b"
	>
		<Breadcrumbs crumbs={data.routing.breadcrumbs} />
		<h1 class="c-text-heading-lg tablet:mt-10 desktop:mt-15 mt-8">
			{data.post.title}
		</h1>
		<p class="mt-6">{data.post.description}</p>
		<div class="tablet:mt-10 desktop:mt-15 relative mt-8">
			<NotByAiBadge class="bg-surface absolute -left-4 -top-4" locale={data.locales.notByAiBadge} />
			<enhanced:img class="h-auto w-full" src={thumbnail} alt="" />
		</div>
		<div class="mt-6 space-y-4">
			<ul class="tablet:justify-end relative flex items-center gap-2">
				{#each data.post.categories as { name, slug }}
					<li class="">
						<a
							class="c-link-lazy c-text-body-sm text-on-surface-subtle hover:text-link
							hover:border-link border-outline rounded-full border px-3 py-1 leading-tight"
							href={routing.path('blog/categories/:category', slug)}
						>
							{name}
						</a>
					</li>
				{/each}
			</ul>
			<ul class="flex flex-wrap items-start gap-6">
				{#each data.post.authors as { name, id, avatar, description }}
					{@const href = routing.path('people/:id', id)}
					<li class="flex items-center gap-3">
						<a {href}>
							<Avatar class="h-12 w-12" src={avatar} {name} border="ellipse" />
						</a>
						<div class="space-y-1">
							<p class="font-bold"><a class="c-link-lazy" {href}>{name}</a></p>
							<p class="text-on-surface-subtle">{description}</p>
						</div>
					</li>
				{/each}
			</ul>
			<div class="bg-outline h-px w-full"></div>
			<div class="text-on-surface-subtle flex justify-between">
				<div class="space-y-2">
					<p>
						{#if data.post.translation === 'manual'}
							<T message={locales.lang_manual_translation} />
						{:else}
							<T message={locales.lang_original} />
						{/if}
						<HintedText class="ml-1 cursor-help">
							<i class="i i-[info] h-5 w-5"></i>
							{#snippet hint()}
								{#if data.post.translation === 'manual'}
									<T message={locales.lang_manual_translation_description} />
								{:else}
									<T message={locales.lang_original_description} />
								{/if}
							{/snippet}
						</HintedText>
					</p>
					<p>
						<span>
							{data.post.readMinutes}
							<T message={locales.read_minutes} />
						</span>,
						<span>
							~
							{data.post.numWords}
							<T message={locales.word} />
						</span>
					</p>
				</div>
				<p class="capitalize">{dateFormatter.format(data.post.publishedAt)}</p>
			</div>
		</div>
	</section>

	<div
		class="_container tablet:gap-8 desktop:gap-10 max-w-pad tablet:pb-15 desktop:pb-20 widescreen:gap-20 grid gap-10 py-10"
		data-hydrated={settings.hydrated}
	>
		<!-- table of contents -->
		<div class="_toc">
			{#if toc.items.size}
				<section class="tablet:sticky top-header space-y-6">
					<h2 class="c-text-heading border-b"><T message={locales.toc_heading} /></h2>
						<ul class="space-y-1">
							{#each toc.items.values() as tocItem (tocItem.id)}
								{@const level = tocItem.element.tagName.slice(1)}
								<li>
									<!-- svelte-ignore a11y_missing_attribute -->
									<a
										use:toc.actions.link={tocItem}
										class="c-link-lazy current:text-link block py-1 capitalize"
										style:padding-left="calc(({level} - 2) * 1ch)"
									>
										<!-- textContent injected by toc -->
									</a>
								</li>
							{/each}
						</ul>
				</section>
			{/if}
		</div>

		<!-- content -->
		<section class="_content prose max-w-full" use:toc.actions.root>
			<h2>What is Lorem Ipsum?</h2>
			<p>
				Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
				been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
				galley of type and scrambled it to make a type specimen book. It has survived not only five
				centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
				It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
				passages, and more recently with desktop publishing software like Aldus PageMaker including
				versions of Lorem Ipsum.
			</p>
			<h3>Why do we use it?</h3>
			<p>
				It is a long established fact that a reader will be distracted by the readable content of a
				page when looking at its layout. The point of using Lorem Ipsum is that it has a
				more-or-less normal distribution of letters, as opposed to using 'Content here, content
				here', making it look like readable English. Many desktop publishing packages and web page
				editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will
				uncover many web sites still in their infancy. Various versions have evolved over the years,
				sometimes by accident, sometimes on purpose (injected humour and the like).
			</p>
			<h3>Where does it come from?</h3>
			<p>
				Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece
				of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock,
				a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure
				Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the
				word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from
				sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and
				Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very
				popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit
				amet..", comes from a line in section 1.10.32.
			</p>
			<p>
				The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those
				interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are
				also reproduced in their exact original form, accompanied by English versions from the 1914
				translation by H. Rackham.
			</p>
			<h4>Where can I get some?</h4>
			<p>
				There are many variations of passages of Lorem Ipsum available, but the majority have
				suffered alteration in some form, by injected humour, or randomised words which don't look
				even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be
				sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum
				generators on the Internet tend to repeat predefined chunks as necessary, making this the
				first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined
				with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.
				The generated Lorem Ipsum is therefore always free from repetition, injected humour, or
				non-characteristic words etc.
			</p>
			<h2>Random Stretching</h2>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus quis eros et odio
				fringilla eleifend. Curabitur id lacus sit amet nibh sollicitudin fermentum. Ut vel feugiat
				elit. Aenean lorem ipsum, feugiat quis urna vel, efficitur ultricies ipsum. Donec a
				ultricies risus. Suspendisse potenti. Pellentesque ultricies ligula sit amet ornare
				vehicula. Maecenas ligula massa, mollis nec cursus in, euismod vitae nunc. Donec euismod
				viverra metus, eu aliquam sapien vestibulum vel. Vivamus sagittis in lectus quis fermentum.
				Nulla rhoncus porttitor massa, ac tempus orci tempor mattis.
			</p>
			<p>
				Praesent a risus est. Suspendisse potenti. Cras ultricies, leo auctor euismod tristique,
				urna sapien hendrerit nisi, non cursus felis nibh et urna. Cras vel nulla porttitor, viverra
				urna eu, sodales purus. Aliquam non purus mauris. Donec imperdiet lectus convallis est
				mollis tincidunt quis et ipsum. Nulla quis tellus id massa fringilla iaculis vel ut est.
			</p>
			<p>
				Nunc pulvinar tellus non massa sodales, id porttitor leo commodo. Nam finibus, magna at
				facilisis convallis, mi nulla faucibus justo, quis ultrices enim libero ut risus. Maecenas
				lorem nisi, maximus vitae rhoncus quis, mollis nec augue. Sed non ornare turpis. Proin
				tempus finibus enim id imperdiet. Pellentesque consectetur efficitur nibh vitae aliquam.
			</p>
			<p>
				Mauris hendrerit lorem sed bibendum commodo. Donec non varius ligula. Vestibulum ante ipsum
				primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse consequat
				maximus nisi. Duis congue ornare neque, in auctor mauris dignissim ut. Proin eu quam ac enim
				placerat rhoncus. Donec magna urna, venenatis nec libero eu, sodales volutpat lacus.
				Curabitur ut accumsan ante, non finibus lectus. Nulla ante lacus, luctus a nulla a, rhoncus
				viverra velit.
			</p>
		</section>

		<!-- sharing -->
		<div class="_sharing">
			<section class={["space-y-6", !settings.hydrated && 'sticky top-header']}>
				<h2 class="c-text-heading border-b"><T message={locales.share_heading} /></h2>
				<ul class="flex flex-wrap gap-4">
					{#if settings.hydrated}
						<li>
							<CopyIconBtn text={url} aria={locales.copy.toString()} />
						</li>
					{/if}
					<li>
						<a
							class="c-link-icon flex rounded-full border border-current p-2"
							href="https://bsky.app/intent/compose?text={encodedUrl}"
							data-external
						>
							<span class="sr-only">Bluesky</span>
							<i class="i i-[butterfly] h-6 w-6"></i>
						</a>
					</li>
					<li>
						<a
							class="c-link-icon flex rounded-full border border-current p-2"
							href="https://www.facebook.com/sharer/sharer.php?u={encodedUrl}"
							data-external
						>
							<span class="sr-only">Facebook</span>
							<i class="i i-[facebook-logo] h-6 w-6"></i>
						</a>
					</li>
					<li>
						<a
							class="c-link-icon flex rounded-full border border-current p-2"
							href="https://www.linkedin.com/shareArticle?mini=true&url={encodedUrl}&title={data.post
							.title}"
							data-external
						>
							<span class="sr-only">Linkedin</span>
							<i class="i i-[linkedin-logo] h-6 w-6"></i>
						</a>
					</li>
					<li>
						{#if settings.hydrated}
							<button
								class="c-link-icon flex rounded-full border border-current p-2"
								onclick={openQrDialog}
							>
								<span class="sr-only">QR Code</span>
								<i class="i i-[qr-code] h-6 w-6"></i>
							</button>
						{/if}
					</li>
				</ul>
			</section>
		</div>

		<!-- latest blog post -->
		<section class="_latest space-y-6">
			<h2 class="c-text-heading border-b"><T message={locales.latest_heading} /></h2>
			<BlogPostListItem post={data.latestPost} />
		</section>
	</div>
</main>

<style lang="postcss">
	@import '@sveltevietnam/ui/css/medias';

	._container {
		grid-template-areas:
			'toc'
			'content'
			'sharing'
			'latest';
		grid-template-columns: 1fr;
		grid-template-rows: repeat(4, auto);

		@media (--tablet) {
			grid-template-areas:
				'content sharing'
				'content toc'
				'content latest';
			grid-template-columns: 1fr 16rem;
			grid-template-rows: 1fr auto auto;

			&[data-hydrated]:not([data-hydrated='false']) {
				grid-template-rows: auto 1fr auto;
			}
		}

		@media (--widescreen) {
			grid-template-columns: 1fr 20rem;
		}
	}

	._toc {
		grid-area: toc;
	}

	._sharing {
		grid-area: sharing;
	}

	._content {
		grid-area: content;
	}

	._latest {
		grid-area: latest;
	}
</style>
