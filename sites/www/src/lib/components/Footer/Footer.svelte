<script lang="ts">
	import { EMAILS, SOCIAL_LINKS } from '$lib/constants';
	import { getLangContext } from '$lib/contexts/lang';
	import { getRoutingContext } from '$lib/routing/routing.context';

	import { translations } from './translation';

	export let version: string;

	const { routes, is } = getRoutingContext();
	const { lang, t } = getLangContext();

	$: tComponent = translations[$lang];
	$: footerRoutes = [
		$routes.home,
		$routes.blog,
		$routes.events,
		$routes.jobs,
		// $routes.impact,
		// $routes.people,
		$routes.sponsor,
		$routes.roadmap,
		$routes.design,
	];
</script>

<footer>
	<div class="footer-top max-w-pad">
		<section class="footer-about-us">
			<p class="footer-section-title c-text-h4 font-medium">{tComponent.aboutUs.title}</p>
			<p>{tComponent.aboutUs.description}</p>
		</section>
		<section class="footer-navigation">
			<p class="footer-section-title c-text-h4 font-medium">{tComponent.navigation.title}</p>
			<nav aria-label="all internal pages" data-sveltekit-preload-data="hover">
				<ul>
					{#each footerRoutes as { path, label }}
						{@const current = $is(path)}
						<li>
							<a aria-current={current} href={path} class="c-link c-link--lazy">{label}</a>
						</li>
					{/each}
				</ul>
			</nav>
		</section>
		<section class="footer-contact">
			<p class="footer-section-title c-text-h4 font-medium">{tComponent.contact.title}</p>
			<ul>
				<li>
					<a href={SOCIAL_LINKS.DISCORD} class="c-link c-link--lazy" external>
						<svg inline-src="simpleicon/discord" width="24" height="24" />
						<span>{$t.common.sveltevienam}</span>
					</a>
				</li>
				<li>
					<a href="mailto:{EMAILS.CONTACT}" class="c-link c-link--lazy" external>
						<svg inline-src="lucide/mail" width="24" height="24" />
						<span>{EMAILS.CONTACT}</span>
					</a>
				</li>
			</ul>
		</section>
		<p class="c-text-h3 ml-auto text-right uppercase leading-normal upto-pc:hidden">
			Svelte <br class="" /> Vietnam
		</p>
	</div>
	<div class="footer-middle max-w-pad">
		<div class="mr-auto">
			<a href="https://www.thegreenwebfoundation.org/green-web-check/?url=sveltevietnam.dev">
				<img
					src="https://api.thegreenwebfoundation.org/greencheckimage/sveltevietnam.dev?nocache=true"
					alt="This website is hosted Green - checked by thegreenwebfoundation.org"
					width="240"
					height="112.5"
					class="badge-greenwebfoundation"
				/>
			</a>
		</div>
		<ul class="footer-socials">
			<li>
				<a href={SOCIAL_LINKS.OPEN_COLLECTIVE} class="c-link c-link--icon" external>
					<span class="sr-only">Open Collective</span>
					<svg height="16" width="16" inline-src="simpleicon/opencollective" />
				</a>
			</li>
			<li>
				<a href={SOCIAL_LINKS.GITHUB} class="c-link c-link--icon" external>
					<span class="sr-only">Github</span>
					<svg height="16" width="16" inline-src="lucide/github" stroke-width="2" />
				</a>
			</li>
			<li>
				<a href={SOCIAL_LINKS.YOUTUBE} class="c-link c-link--icon" external>
					<span class="sr-only">Youtube</span>
					<svg height="16" width="16" inline-src="lucide/youtube" stroke-width="2" />
				</a>
			</li>
			<li>
				<a href={SOCIAL_LINKS.TWITTER} class="c-link c-link--icon" external>
					<span class="sr-only">Twitter</span>
					<svg height="16" width="16" inline-src="lucide/twitter" stroke-width="2" />
				</a>
			</li>
			<li>
				<a href={SOCIAL_LINKS.FACEBOOK} class="c-link c-link--icon" external>
					<span class="sr-only">Facebook</span>
					<svg height="16" width="16" inline-src="lucide/facebook" stroke-width="2" />
				</a>
			</li>
		</ul>
	</div>
	<div class="footer-bottom max-w-pad c-text-cap2">
		<p>{tComponent.version} {version}</p>
		<p class="footer-info">
			<span>
				{new Date().getFullYear()} © {$t.common.sveltevienam}
			</span>
			<span aria-disabled class="vertical-separator">|</span>
			<span>
				{tComponent.poweredBy}
				<a href="https://kit.svelte.dev/" external>
					<svg class="inline-block" height="14" width="14" inline-src="svelte" />
				</a>
				<a href="https://tailwindcss.com/" external>
					<svg class="inline-block" height="14" width="14" inline-src="simpleicon/tailwindcss" />
				</a>
				<a href="https://www.cloudflare.com/" external>
					<svg
						class="inline-block"
						height="14"
						width="14"
						inline-src="simpleicon/cloudflarepages"
					/>
				</a>
			</span>
		</p>
		<p class="footer-additional-links">
			<a
				href={$routes.settings.path}
				class="c-link c-link--lazy"
				aria-current={$is($routes.settings.path)}>{$routes.settings.label}</a
			>
			<span aria-disabled class="vertical-separator">|</span>
			<a
				href={$routes.codeOfConduct.path}
				class="c-link c-link--lazy"
				aria-current={$is($routes.codeOfConduct.path)}>{$routes.codeOfConduct.label}</a
			>
			<span aria-disabled class="vertical-separator">|</span>
			<a href={$routes.rss.path} class="c-link c-link--lazy" external>RSS</a>
			<span aria-disabled class="vertical-separator">|</span>
			<a href={$routes.sitemap.path} class="c-link c-link--lazy" external>Sitemap</a>
		</p>
	</div>
</footer>

<style lang="postcss">
	footer {
		position: relative;
		background-color: theme('colors.neutral.DEFAULT');
		border-top: 1px solid theme('colors.outline.DEFAULT');

		&::before {
			content: '';

			position: absolute;
			z-index: -2;
			right: 0;
			bottom: calc(100% + 1px);
			left: 0;

			height: 150px;

			background: linear-gradient(to bottom, transparent, theme('colors.neutral.DEFAULT') 100%);

			@screen pc {
				height: 200px;
			}
		}
	}

	.footer-top {
		display: flex;
		flex-direction: column;
		gap: 32px;

		width: 100%;
		margin-top: 40px;

		@screen pc {
			flex-direction: row;
			gap: 64px;
			align-items: flex-start;
			justify-content: space-between;

			margin-top: 60px;
		}

		@screen xl {
			gap: 64px;
		}
	}

	.footer-section-title {
		margin-bottom: 24px;

		@screen pc {
			margin-bottom: 32px;
		}
	}

	.footer-about-us {
		@screen pc {
			width: 262px;
		}
	}

	.footer-navigation {
		& ul {
			display: grid;
			grid-template-columns: repeat(3, min-content);
			row-gap: 16px;
			column-gap: 32px;

			white-space: nowrap;

			@screen pc {
				grid-template-columns: repeat(2, auto);
				row-gap: 12px;
				column-gap: 24px;
			}
		}
	}

	.footer-contact {
		& ul {
			display: flex;
			flex-direction: column;
			gap: 16px;

			@screen pc {
				gap: 12px;
			}
		}

		& a {
			display: flex;
			gap: 8px;
			align-items: center;
		}
	}

	.footer-middle {
		display: flex;
		flex-direction: column;
		gap: 24px;

		margin-top: 40px;
		margin-bottom: 24px;

		@screen pc {
			flex-direction: row;
			align-items: flex-end;
			margin-top: 80px;
		}
	}

	.badge-greenwebfoundation {
		margin-left: -5px;
		margin-block: -8px;
	}

	.footer-socials {
		display: flex;
		gap: 12px;
		align-items: center;

		@screen pc {
			justify-content: flex-end;
			margin-top: 40px;
		}

		& a {
			display: block;
			padding: 7px;
			border: 1px solid currentcolor;
			border-radius: theme('borderRadius.full');
		}
	}

	.footer-bottom {
		position: relative;

		display: flex;
		flex-direction: column-reverse;
		gap: 16px;
		align-items: flex-start;

		padding-top: 20px;
		padding-bottom: 20px;

		border-top: 1px solid theme('colors.outline.DEFAULT');

		@screen pc {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;

			padding-top: 12px;
			padding-bottom: 12px;
		}
	}

	.footer-info {
		display: flex;
		gap: 8px;
		align-items: center;

		@screen pc {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}

		& a {
			filter: grayscale(1);

			&:hover {
				filter: none;
			}
		}
	}

	.footer-additional-links {
		display: flex;
		gap: 16px;
		align-items: center;
	}
</style>
