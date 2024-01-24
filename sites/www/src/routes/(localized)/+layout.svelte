<script lang="ts" context="module">
	const translations = {
		en: {
			newVersion:
				'A new version of the site was released. Please reload the page at your convenience for the best experience.',
			slowHydration:
				'Interrupt has been detected due to unstable network. We are sorry for this inconvenience!',
		},
		vi: {
			newVersion:
				'Trang web đang được cập nhật với phiên bản mới. Tải lại trang để có trải nghiệm tốt nhất bạn nhé!',
			slowHydration:
				'Phát hiện gián đoạn do kết nối không ổn định. Xin lỗi bạn vì sự bất tiện này!',
		},
	};
</script>

<script lang="ts">
	import { LANGUAGES } from '@internals/utils/language';
	import { localizeUrl } from '@internals/utils/url';
	import { lockscroll } from '@svelte-put/lockscroll';
	import ModalPortal from '@svelte-put/modal/ModalPortal.svelte';
	import { onMount } from 'svelte';

	import { version } from '$app/environment';
	import { beforeNavigate, goto } from '$app/navigation';
	import { navigating, page, updated } from '$app/stores';
	import { PUBLIC_DISCORD_WS_URL } from '$env/static/public';
	import { Footer } from '$lib/components/Footer';
	import { Header } from '$lib/components/Header';
	import { setLangContext } from '$lib/contexts/lang';
	import { setLockScrollContext } from '$lib/contexts/lockscroll.js';
	import { setSettingsContext } from '$lib/contexts/settings';
	import { setSplashContext } from '$lib/contexts/splash.js';
	import { modalStore } from '$lib/modals';
	import NotificationPortal from '$lib/notifications/NotificationPortal.svelte';
	import { setNotificationContext } from '$lib/notifications/index.js';
	import { setRoutingContext } from '$lib/routing/routing.context';

	import type { LayoutData } from './$types';
	import PageLoadIndicator from './_page/components/PageLoadIndicator.svelte';

	export let data: LayoutData;

	// CONTEXTS
	const splashStore = setSplashContext();
	const lockScrollStore = setLockScrollContext();
	const { language, accessibility, colorScheme, splash } = setSettingsContext(data.settings);
	setLangContext(language);
	const noti = setNotificationContext();
	const { current } = setRoutingContext(language, $page.data.route);

	$: $current = $page.data.route;
	$: $language = data.settings.language;
	$: $colorScheme = data.settings.colorScheme;
	$: $splash = data.settings.splash;
	$: $accessibility = data.settings.accessibility;

	type DiscordEventData = {
		type: 'message';
		data: {
			avatarURL: string;
			name: string;
		};
	};

	// FIXME: extract to own service
	onMount(() => {
		try {
			const ws = new WebSocket(PUBLIC_DISCORD_WS_URL);
			ws.addEventListener('message', (event) => {
				try {
					const payload = JSON.parse(event.data) as DiscordEventData;
					if (payload.type === 'message') {
						noti.helpers.discord({
							...payload.data,
							language: $language,
						});
					}
				} catch (error) {
					console.error(error);
				}
			});
			return () => {
				ws.close();
			};
		} catch (e) {
			//
		}
	});

	/**
	 * If going from a localized url to a non-localized url,
	 * reroute to keep the lang segment. For example:
	 * navigate from `/en/blog` to `/events` will reroute to `/en/events`
	 *
	 * This allows all links in site to exclude lang segment but user
	 * still sees a consistent display language, unless they change it explicitly
	 */
	beforeNavigate(({ to, cancel, from }) => {
		const fromLang = from?.params?.lang;
		const toLang = to?.params?.lang;
		if (to && fromLang && !toLang) {
			cancel();
			const localized = localizeUrl(to.url, fromLang, LANGUAGES);
			goto(localized);
		}
	});

	let notifiedAboutNewVersion = false;
	$: if ($updated && !notifiedAboutNewVersion) {
		notifiedAboutNewVersion = true;
		noti.helpers.info(translations[$language].newVersion);
	}

	let notifiedAboutSlowHydration = false;
	$: if ($splashStore.isSlowHydration && !notifiedAboutSlowHydration) {
		notifiedAboutSlowHydration = true;
		noti.helpers.info(translations[$language].slowHydration);
	}
</script>

<svelte:document use:lockscroll={lockScrollStore} />

{#if $navigating}
	<PageLoadIndicator />
{/if}

<Header />
<slot />
<Footer {version} />

<!-- portals -->
<ModalPortal store={modalStore} class="z-modal" />
<NotificationPortal />
