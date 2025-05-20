<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import type { HTMLAttributes } from 'svelte/elements';

	import { EMAILS } from '$data/emails';
	import { SOCIAL_LINKS } from '$data/links';
	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import * as n from '$data/routes/generated/names';
	import { GreenWebBadge } from '$lib/components/green-web-badge';
	import { NotByAiBadge } from '$lib/components/not-by-ai-badge';
	import { SocialLinks } from '$lib/components/social-links';
	import { RoutingContext } from '$lib/routing/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	let {
		version,
		class: cls,
		...rest
	}: HTMLAttributes<HTMLElement> & {
		version: string;
	} = $props();

	const routing = RoutingContext.get();
	const settings = SettingsContext.get();

	let primaryPages = $derived([
		{
			path: p['/:lang']({ lang: settings.language }),
			name: n['/:lang'](settings.language),
		},
		{
			path: p['/:lang/blog']({ lang: settings.language }),
			name: n['/:lang/blog'](),
		},
		{
			path: p['/:lang/events']({ lang: settings.language }),
			name: n['/:lang/events'](settings.language),
		},
		{
			path: p['/:lang/jobs']({ lang: settings.language }),
			name: n['/:lang/jobs'](settings.language),
		},
		{
			path: p['/:lang/sponsor']({ lang: settings.language }),
			name: n['/:lang/sponsor'](settings.language),
		},
		{
			path: p['/:lang/people']({ lang: settings.language }),
			name: n['/:lang/people'](settings.language),
		},
		{
			path: p['/:lang/roadmap']({ lang: settings.language }),
			name: n['/:lang/roadmap'](settings.language),
		},
		{
			path: p['/:lang/design']({ lang: settings.language }),
			name: n['/:lang/design'](settings.language),
		},
	] as const);
	let secondaryPages = $derived([
		{
			path: p['/:lang/settings']({ lang: settings.language }),
			name: n['/:lang/settings'](settings.language),
		},
		{
			path: p['/:lang/code-of-conduct']({ lang: settings.language }),
			name: n['/:lang/code-of-conduct'](settings.language),
		},
		{
			path: p['/:lang/sitemap.xml']({ lang: settings.language }),
			name: n['/:lang/sitemap.xml'](settings.language),
		},
		{
			path: p['/:lang/rss.xml']({ lang: settings.language }),
			name: n['/:lang/rss.xml'](),
		},
	] as const);
</script>

<footer
	class={['from-primary-surface to-surface relative bg-gradient-to-t', cls]}
	{...rest}
	data-sveltekit-preload-data="hover"
	id="footer"
>
	<div class="max-w-pad _upper border-y pb-10 pt-14">
		<p
			class="_name c-text-heading tablet:block tablet:text-right w-37.5 tablet:justify-self-end hidden uppercase"
		>
			<T message={m['svelte_vietnam.name']} />
		</p>

		<section class="_about tablet:space-y-6 tablet:max-w-70 space-y-4">
			<p class="c-text-title"><T message={m['components.footer.about.title']} /></p>
			<p class="leading-relaxed"><T message={m['components.footer.about.desc']} /></p>
		</section>

		<section class="_pages tablet:space-y-6 space-y-4">
			<p class="c-text-title"><T message={m['components.footer.navigation']} /></p>
			<ul class="-mx-1 grid w-fit grid-cols-2 gap-x-4 gap-y-2">
				{#each primaryPages as { path, name } (path)}
					{@const current = routing.is(path)}
					<li>
						<a class="c-link-lazy px-1 py-1" href={path} aria-current={current}>{name}</a>
					</li>
				{/each}
			</ul>
		</section>

		<section class="_contacts">
			<p class="c-text-title"><T message={m['components.footer.contact']} /></p>
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
						<i class="i i-[ph--discord-logo] h-6 w-6"></i>
						<T message={m['svelte_vietnam.discord']} />
					</a>
				</li>
				<li>
					<a
						class="c-link-lazy flex items-center gap-2 py-1"
						href="mailto:{EMAILS.CONTACT}"
						rel="noreferrer"
						target="_blank"
					>
						<i class="i i-[ph--envelope-simple] h-6 w-6"></i>
						{EMAILS.CONTACT}
					</a>
				</li>
			</ul>
		</section>

		<section class="_socials self-end justify-self-start">
			<SocialLinks />
		</section>

		<section class="_badges tablet:justify-end flex flex-wrap items-end gap-4">
			<NotByAiBadge />
			<GreenWebBadge />
		</section>
	</div>

	<div class="_lower max-w-pad c-text-body-xs py-4">
		<ul class="_pages-secondary tablet:justify-self-end -mx-1 flex items-center">
			{#each secondaryPages as { path, name } (path)}
				{@const current = routing.is(path)}
				<li class="not-first:border-l not-first:pl-2 not-last:pr-2 border-current">
					<a class="c-link-lazy px-1 py-1" href={path} aria-current={current}>{name}</a>
				</li>
			{/each}
		</ul>
		<div class="_license-and-techs tablet:max-widescreen:contents flex items-center gap-1">
			<p class="_license">{new Date().getFullYear()} © <T message={m['svelte_vietnam.name']} /></p>
			<p class="tablet:max-widescreen:hidden">|</p>
			<p class="_techs tablet:justify-self-end flex items-center gap-2">
				<T message={m['components.footer.powered_by']} />
				<a class="c-link-lazy" href="https://www.cloudflare.com">
					<span class="sr-only">Cloudflare</span>
					<i class="i i-[simple-icons--cloudflareworkers] h-4 w-4"></i>
				</a>
				<a class="c-link-lazy" href="https://svelte.dev">
					<span class="sr-only">Svelte and SvelteKit</span>
					<i class="i i-[simple-icons--svelte] h-4 w-4"></i>
				</a>
				<a class="c-link-lazy" href="https://tailwindcss.com">
					<span class="sr-only">TailwindCSS</span>
					<i class="i i-[simple-icons--tailwindcss] h-4 w-4"></i>
				</a>
			</p>
		</div>
		<p class="_version"><T message={m.version} /> {version}</p>
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
				'socials socials badges badges';
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
			grid-template-areas: 'version license-and-techs pages';
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
