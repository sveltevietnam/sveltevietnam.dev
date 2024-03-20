<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { LOAD_DEPENDENCIES } from '$lib/constants';
	import { getLangContext } from '$lib/contexts/lang';
	import { getRoutingContext } from '$lib/routing/routing.context';

	let cls = '';
	export { cls as class };

	const { current } = getRoutingContext();
	const { lang, t } = getLangContext();

	function changeLanguage(lang: App.Language) {
		if (lang !== document.documentElement.getAttribute('lang')) {
			invalidate(LOAD_DEPENDENCIES.LANGUAGE);
			document.documentElement.setAttribute('lang', lang);
		}
	}
</script>

<nav
	aria-label={$t.common.language}
	data-sveltekit-noscroll
	class="contents"
	data-sveltekit-preload-data="hover"
>
	<ul class="flex h-8 w-fit items-center rounded-full border border-current px-3 {cls}">
		<li>
			<a
				lang="en"
				aria-current={$lang === 'en'}
				href="{$current.alternate.en.path}{$page.url.search}"
				on:click={() => changeLanguage('en')}
			>
				<span class="sr-only">English</span>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M2 18V6H9.52344V7.55859H3.81055V11.2148H9.13086V12.7676H3.81055V16.4414H9.59375V18H2Z"
						fill="currentcolor"
					/>
					<path
						d="M21.6274 6V18H19.9634L13.8638 9.19922H13.7524V18H11.9419V6H13.6177L19.7231 14.8125H19.8345V6H21.6274Z"
						fill="currentcolor"
					/>
				</svg>
			</a>
		</li>
		<li class="mx-2 h-3 w-px bg-current" />
		<li>
			<a
				lang="vi"
				aria-current={$lang === 'vi'}
				href="{$current.alternate.vi.path}{$page.url.search}"
				on:click={() => changeLanguage('vi')}
			>
				<span class="sr-only">Tiếng Việt</span>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M6.95703 6L10.2969 15.7734H10.4316L13.7715 6H15.7285L11.4102 18H9.31836L5 6H6.95703Z"
						fill="currentcolor"
					/>
					<path d="M19.272 6V18H17.4614V6H19.272Z" fill="currentcolor" />
				</svg>
			</a>
		</li>
	</ul>
</nav>

<style lang="postcss">
	a {
		display: block;
		text-transform: uppercase;
		transition: opacity var(--transition-duration) var(--transition-timing-function);

		&[aria-current='false'] {
			color: currentcolor;
			opacity: 0.6;
		}

		&:hover {
			opacity: 1;
		}

		&[aria-current]:not([aria-current='false']) {
			color: theme('colors.link.DEFAULT');
		}
	}
</style>
