<script lang="ts">
	import { getLangContext } from '$client/contexts/lang';
	import { EMAILS, SOCIAL_LINKS } from '$shared/constants';
	import { translations as commonT } from '$shared/services/i18n/translations/common';
	import {
		CODE_OF_CONDUCT_PATH,
		FOOTER_PATHS,
		RSS_PATH,
		SITEMAP_PATH,
		getPathLabel,
		isCurrentPage,
	} from '$shared/services/navigation';

	import { translations } from './translation';

	export let pathname: string;
	export let version: string;

	const langStore = getLangContext();
	$: lang = $langStore;

	$: t = translations[lang];
</script>

<footer>
	<div class="footer-top max-w-pad">
		<div class="footer-sections">
			<section class="footer-about-us">
				<p class="footer-section-title tp-h4 font-medium">{t.aboutUs.title}</p>
				<p>{t.aboutUs.description}</p>
			</section>
			<section class="footer-navigation">
				<p class="footer-section-title tp-h4 font-medium">{t.navigation.title}</p>
				<nav aria-label="all internal pages" data-sveltekit-preload-data="hover">
					<ul>
						{#each FOOTER_PATHS as href}
							{@const current = isCurrentPage(pathname, href)}
							<li>
								<a aria-current={current} {href} class="c-link c-link--lazy"
									>{getPathLabel(href, lang)}</a
								>
							</li>
						{/each}
					</ul>
				</nav>
			</section>
			<section class="footer-contact">
				<p class="footer-section-title tp-h4 font-medium">{t.contact.title}</p>
				<ul>
					<li>
						<a href={SOCIAL_LINKS.DISCORD} class="c-link c-link--lazy" external>
							<svg inline-src="simpleicon/discord" width="24" height="24" />
							<span>{commonT[lang].sveltevienam}</span>
						</a>
					</li>
					<li>
						<a href="mailto:{EMAILS.CONTACT}" class="c-link c-link--lazy" external>
							<svg inline-src="google/mail" width="24" height="24" />
							<span>{EMAILS.CONTACT}</span>
						</a>
					</li>
				</ul>
			</section>
		</div>
		<p class="tp-h3 text-right uppercase leading-normal upto-pc:hidden">
			Svelte <br class="" /> Vietnam
		</p>
	</div>
	<ul class="footer-socials max-w-pad">
		<li>
			<a href={SOCIAL_LINKS.OPEN_COLLECTIVE} class="c-link c-link--icon" external>
				<span class="sr-only">Open Collective</span>
				<svg height="16" width="16" inline-src="simpleicon/opencollective" />
			</a>
		</li>
		<li>
			<a href={SOCIAL_LINKS.GITHUB} class="c-link c-link--icon" external>
				<span class="sr-only">Github</span>
				<svg height="16" width="16" inline-src="simpleicon/github" />
			</a>
		</li>
		<li>
			<a href={SOCIAL_LINKS.YOUTUBE} class="c-link c-link--icon" external>
				<span class="sr-only">Youtube</span>
				<svg height="16" width="16" inline-src="simpleicon/youtube" />
			</a>
		</li>
		<li>
			<a href={SOCIAL_LINKS.TWITTER} class="c-link c-link--icon" external>
				<span class="sr-only">Twitter</span>
				<svg height="16" width="16" inline-src="simpleicon/twitter" />
			</a>
		</li>
		<li>
			<a href={SOCIAL_LINKS.FACEBOOK} class="c-link c-link--icon" external>
				<span class="sr-only">Facebook</span>
				<svg height="16" width="16" inline-src="simpleicon/facebook" />
			</a>
		</li>
	</ul>
	<div class="footer-bottom tp-cap2 max-w-pad">
		<p>{t.version} {version}</p>
		<p class="footer-info">
			<span>
				{new Date().getFullYear()} © {commonT[lang].sveltevienam}
			</span>
			<span aria-disabled class="vertical-separator">|</span>
			<span>
				{t.poweredBy}
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
				href={CODE_OF_CONDUCT_PATH}
				class="c-link c-link--lazy"
				aria-current={isCurrentPage(pathname, CODE_OF_CONDUCT_PATH)}>{t.navigation.codeOfConduct}</a
			>
			<span aria-disabled class="vertical-separator">|</span>
			<a href={RSS_PATH} class="c-link c-link--lazy" external>RSS</a>
			<span aria-disabled class="vertical-separator">|</span>
			<a href={SITEMAP_PATH} class="c-link c-link--lazy" external>Sitemap</a>
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
		width: 100%;
		margin-top: 40px;

		@screen pc {
			display: flex;
			gap: 64px;
			align-items: flex-start;
			justify-content: space-between;

			margin-top: 60px;
		}
	}

	.footer-sections {
		display: flex;
		flex-direction: column;
		gap: 32px;

		@screen pc {
			flex-direction: row;
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

	.footer-socials {
		display: flex;
		gap: 12px;
		align-items: center;

		margin-top: 40px;
		margin-bottom: 24px;

		@screen pc {
			justify-content: flex-end;
			margin-top: 80px;
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
