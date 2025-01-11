<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import type { HTMLAttributes } from 'svelte/elements';

	import { EMAILS } from '$data/emails';
	import { SOCIAL_LINKS } from '$data/links';
	import { GreenWebBadge } from '$lib/components/green-web-badge';
	import { NotByAiBadge } from '$lib/components/not-by-ai-badge';
	import { SocialLinks } from '$lib/components/social-links';
	import { RoutingContext } from '$lib/routing/context.svelte';

	let {
		version,
		locale,
		localeGreenWebBadge,
		localeNotByAiBadge,
		...rest
	}: HTMLAttributes<HTMLElement> & {
		version: string;
		locale: import('./locales/generated').Locale;
		localeGreenWebBadge: import('$lib/components/green-web-badge/locales/generated').Locale;
		localeNotByAiBadge: import('$lib/components/not-by-ai-badge/locales/generated').Locale;
	} = $props();

	const routing = RoutingContext.get();

	let primaryPages = $derived(['home', 'blog', 'events', 'jobs', 'sponsor', 'roadmap', 'design'] as const);
	let secondaryPages = $derived(['settings', 'code-of-conduct', 'sitemap.xml', 'rss.xml'] as const);
</script>

<footer {...rest}>
	<div class="max-w-pad _upper pb-10 pt-14 border-y">
		<p class="_name c-text-heading tablet:block tablet:text-right w-37.5 hidden uppercase tablet:justify-self-end">
			<T message={locale.sveltevietnam} />
		</p>

		<section class="_about tablet:space-y-6 tablet:max-w-70 space-y-4">
			<p class="c-text-title"><T message={locale.about} /></p>
			<p class="leading-relaxed"><T message={locale.about_description} /></p>
		</section>

		<section class="_pages tablet:space-y-6 space-y-4">
			<p class="c-text-title"><T message={locale.navigation} /></p>
			<ul class="-mx-1 grid w-fit grid-cols-2 gap-x-4 gap-y-2">
				{#each primaryPages as page}
					{@const path = routing.path(page)}
					{@const name = routing.name(page)}
					{@const current = routing.is(page)}
					<li>
						<a class="c-link-lazy px-1 py-1" href={path} aria-current={current}>{name}</a>
					</li>
				{/each}
			</ul>
		</section>

		<section class="_contacts">
			<p class="c-text-title"><T message={locale.contact} /></p>
			<ul
				class="mobile:-mt-1 widescreen:-mt-1 tablet:max-widescreen:flex tablet:max-widescreen:gap-4
				tablet:max-widescreen:items-center"
			>
				<li>
					<a
						class="c-link-lazy flex items-center gap-2 py-1"
						href={SOCIAL_LINKS.DISCORD}
						data-external
					>
						<i class="i i-[discord-logo] h-6 w-6"></i>
						<T message={locale.sveltevietnam} />
						Discord
					</a>
				</li>
				<li>
					<a class="c-link-lazy flex items-center gap-2 py-1" href="mailto:{EMAILS.CONTACT}">
						<i class="i i-[envelope-simple] h-6 w-6"></i>
						{EMAILS.CONTACT}
					</a>
				</li>
			</ul>
		</section>

		<section class="_socials self-end justify-self-start">
			<SocialLinks />
		</section>

		<section class="_badges tablet:justify-end flex flex-wrap items-end gap-4">
			<NotByAiBadge locale={localeNotByAiBadge} />
			<GreenWebBadge locale={localeGreenWebBadge} />
		</section>
	</div>

	<div class="_lower max-w-pad py-4 c-text-body-xs">
		<ul class="_pages-secondary flex items-center -mx-1 tablet:justify-self-end">
			{#each secondaryPages as page}
				{@const path = routing.path(page)}
				{@const name = routing.name(page)}
				{@const current = routing.is(page)}
				<li class="not-first:border-l border-current not-first:pl-2 not-last:pr-2">
					<a class="c-link-lazy px-1 py-1" href={path} aria-current={current}>{name}</a>
				</li>
			{/each}
		</ul>
		<div class="_license-and-techs flex items-center gap-1 tablet:max-widescreen:contents">
			<p class="_license">{new Date().getFullYear()} © <T message={locale.sveltevietnam}/></p>
			<p class="tablet:max-widescreen:hidden">|</p>
			<p class="_techs flex items-center gap-1 tablet:justify-self-end">
				<T message={locale.powered_by}/>
				<a class="c-link-lazy" href="https://www.cloudflare.com">
					<span class="sr-only">Cloudflare</span>
					<svg class="w-5 h-5" inline-src="simpleicons/cloudflare-workers" width="20" height="20"></svg>
				</a>
				<a class="c-link-lazy" href="https://svelte.dev">
					<span class="sr-only">Svelte and SvelteKit</span>
					<svg class="w-5 h-5" inline-src="simpleicons/svelte" width="20" height="20"></svg>
				</a>
				<a class="c-link-lazy" href="https://tailwindcss.com">
					<span class="sr-only">TailwindCSS</span>
					<svg class="w-5 h-5" inline-src="simpleicons/tailwindcss" width="20" height="20"></svg>
				</a>
			</p>
		</div>
		<p class="_version"><T message={locale.version}/> {version}</p>
	</div>
</footer>

<style lang="postcss">
	@import '@sveltevietnam/css/medias';

	._upper {
		display: grid;
		grid-template-areas:
			'about'
			'pages'
			'contacts'
			'socials'
			'badges';
		grid-template-columns: 1fr;
		gap: calc(var(--spacing) * 10);

		@media (--tablet) {
			grid-template-areas:
				'about pages name'
				'contacts contacts contacts'
				'socials badges badges';
			grid-template-columns: repeat(3, auto);
			grid-template-rows: repeat(3, auto);
			row-gap: calc(var(--spacing) * 8);
			justify-content: space-between;
		}

		@media (--widescreen) {
			grid-template-areas:
				'about pages contacts name'
				'socials pages badges badges';
			grid-template-columns: repeat(3, auto) 1fr;
			grid-template-rows: repeat(2, auto);
			row-gap: calc(var(--spacing) * 2);
			column-gap: calc(var(--spacing) * 20);
		}
	}

	._name {
		grid-area: name;
	}

	._about {
		grid-area: about;
	}

	._pages {
		grid-area: pages;
	}

	._contacts {
		display: flex;
		grid-area: contacts;
		flex-direction: column;
		gap: calc(var(--spacing) * 4);

		@media (--tablet) {
			flex-direction: row;
			gap: calc(var(--spacing) * 8);
		}

		@media (--widescreen) {
			flex-direction: column;
			gap: calc(var(--spacing) * 6);
		}
	}

	._socials {
		grid-area: socials;
	}

	._badges {
		grid-area: badges;
	}

	._lower {
		display: grid;
		grid-template-areas:
			'pages'
			'license-and-techs'
			'version';
		grid-template-columns: 1fr;
		gap: calc(var(--spacing) * 4);
		align-items: center;

		@media (--tablet) {
			grid-template-areas:
				'version pages'
				'license techs';
			grid-template-columns: auto auto;
			grid-template-rows: auto auto;
		}

		@media (--widescreen) {
			grid-template-areas:
				'version license-and-techs pages';
			grid-template-columns: 1fr auto 1fr;
			grid-template-rows: 1fr;
		}
	}

	._pages-secondary {
		grid-area: pages;
	}

	._license-and-techs {
		grid-area: license-and-techs;
	}

	._license {
		grid-area: license;
	}

	._techs {
		grid-area: techs;
	}

	._version {
		grid-area: version;
	}
</style>
