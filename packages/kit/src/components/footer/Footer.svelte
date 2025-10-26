<script lang="ts">
	import { T } from '@sveltevietnam/i18n/runtime';
	import { delocalizeUrl } from '@sveltevietnam/i18n/utils';

	import { LANGUAGES } from '@sveltevietnam/kit/constants';

	import { SOCIAL_LINKS } from '../../constants.js';
	import { Contexts } from '../../contexts/index.js';
	import { GreenWebBadge } from '../green-web-badge/index.js';
	import { NotByAiBadge } from '../not-by-ai-badge/index.js';
	import { SocialLinks } from '../social-links/index.js';

	import type { FooterProps } from '.';

	let {
		email,
		domain,
		version,
		i18n,
		navigationPrimary,
		navigationSecondary,
		class: cls,
		...rest
	}: FooterProps = $props();

	const { routing } = Contexts.get();

	const primaryNavigationUlClass = $derived(
		Array.isArray(navigationPrimary) && navigationPrimary.length > 3
			? 'grid-cols-2'
			: 'grid-cols-1',
	);
</script>

<footer
	class={['from-primary-surface to-surface relative bg-gradient-to-t', cls]}
	id="footer"
	data-sveltekit-preload-data="hover"
	{...rest}
>
	<div class="max-w-pad _upper border-y pt-14 pb-10">
		<p
			class="_name c-text-heading tablet:block tablet:text-right tablet:justify-self-end hidden w-37.5 uppercase"
		>
			<T message={i18n.svelte_vietnam} />
		</p>

		<section class="_about tablet:space-y-6 tablet:max-w-70 space-y-4">
			<p class="c-text-title"><T message={i18n.about.heading} /></p>
			<p class="leading-relaxed"><T message={i18n.about.desc} /></p>
		</section>

		<section class="_pages tablet:space-y-6 space-y-4">
			{#if navigationPrimary}
				<p class="c-text-title"><T message={i18n.navigation.heading} /></p>
				{#if typeof navigationPrimary === 'function'}
					{@render navigationPrimary()}
				{:else}
					<ul class={['-mx-1 grid w-fit gap-x-4 gap-y-2', primaryNavigationUlClass]}>
						{#each navigationPrimary as { path, name } (path)}
							{@const current = routing.is(path)}
							<li>
								<a
									class="c-link-lazy px-1 py-1"
									href={path}
									aria-current={current}
									data-umami-event="click-navigation-link"
									data-umami-event-position="footer"
									data-umami-event-path={delocalizeUrl(path, LANGUAGES)}
								>
									{name}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			{/if}
		</section>

		<section class="_contacts">
			<p class="c-text-title"><T message={i18n.contact.heading} /></p>
			<ul
				class="mobile:-mt-1 widescreen:-mt-1 tablet:max-widescreen:flex tablet:max-widescreen:gap-4
				tablet:max-widescreen:items-center"
			>
				<li>
					<a
						class="c-link-lazy flex items-center gap-2 py-1"
						href={SOCIAL_LINKS.DISCORD}
						data-external
						data-umami-event="click-social-link"
						data-umami-event-source="discord"
						data-umami-event-position="footer.contact"
					>
						<i class="i i-[ph--discord-logo] h-6 w-6"></i>
						<T message={i18n.contact.discord} />
					</a>
				</li>
				<li>
					<a class="c-link-lazy flex items-center gap-2 py-1" href="mailto:{email}" data-external>
						<i class="i i-[ph--envelope-simple] h-6 w-6"></i>
						{email}
					</a>
				</li>
			</ul>
		</section>

		<section class="_socials @container w-full self-end justify-self-start">
			<SocialLinks position="footer" />
		</section>

		<section class="_badges tablet:justify-end flex flex-wrap items-end gap-4">
			<NotByAiBadge sr={i18n.not_by_ai} />
			<GreenWebBadge {domain} />
		</section>
	</div>

	<div class="_lower max-w-pad c-text-body-xs py-4">
		<div class="_pages-secondary tablet:justify-self-end -mx-1">
			{#if navigationSecondary}
				<ul class="flex items-center">
					{#if typeof navigationSecondary === 'function'}
						{@render navigationSecondary()}
					{:else}
						{#each navigationSecondary as { path, name } (path)}
							{@const current = routing.is(path)}
							<li class="border-current not-first:border-l not-first:pl-2 not-last:pr-2">
								<a
									class="c-link-lazy px-1 py-1"
									href={path}
									aria-current={current}
									data-umami-event="click-navigation-link"
									data-umami-event-position="footer"
									data-umami-event-path={delocalizeUrl(path, LANGUAGES)}
								>
									{name}
								</a>
							</li>
						{/each}
					{/if}
				</ul>
			{/if}
		</div>
		<div class="_license-and-techs tablet:max-widescreen:contents flex items-center gap-1">
			<p class="_license">{new Date().getFullYear()} © <T message={i18n.svelte_vietnam} /></p>
			<p class="tablet:max-widescreen:hidden">|</p>
			<p class="_techs tablet:justify-self-end flex items-center gap-2">
				<T message={i18n.powered_by} />
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
		<p class="_version"><T message={i18n.version} /> {version}</p>
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
				'socials socials badges';
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
