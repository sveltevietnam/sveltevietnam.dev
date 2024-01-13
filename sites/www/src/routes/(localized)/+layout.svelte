<script lang="ts">
	import { localizeUrl } from '@internals/utils/url';
	import { lockscroll } from '@svelte-put/lockscroll';
	import ModalPortal from '@svelte-put/modal/ModalPortal.svelte';
	import { onMount } from 'svelte';

	import { version } from '$app/environment';
	import { beforeNavigate, goto } from '$app/navigation';
	import { navigating, page, updated } from '$app/stores';
	import { setColorSchemeContext } from '$client/contexts/color-scheme.js';
	import { setLangContext } from '$client/contexts/lang';
	import { setLockScrollContext } from '$client/contexts/lockscroll.js';
	import { setNavigationContext } from '$client/contexts/navigation';
	import { setSplashContext } from '$client/contexts/splash.js';
	import { PUBLIC_DISCORD_WS_URL } from '$env/static/public';
	import { Footer } from '$lib/components/Footer';
	import { Header } from '$lib/components/Header';
	import { modalStore } from '$lib/modals';
	import NotificationPortal from '$lib/notifications/NotificationPortal.svelte';
	import { setNotificationContext } from '$lib/notifications/index.js';
	import { LANGUAGES } from '$shared/services/i18n/index.js';
	import { translations } from '$shared/services/i18n/translations/notification';

	import type { LayoutData } from './$types';
	import PageLoadIndicator from './_page/components/PageLoadIndicator.svelte';

	export let data: LayoutData;

	// CONTEXTS
	const splashStore = setSplashContext();
	const lockScrollStore = setLockScrollContext();
	setColorSchemeContext(data.colorScheme);
	const lang = setLangContext(data.language);
	const noti = setNotificationContext();
	const { current } = setNavigationContext(lang, $page.data.route);

	$: $current = $page.data.route;
	$: $lang = data.language;

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
							language: data.language,
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
		noti.helpers.info(translations[data.language].newVersion);
	}

	let notifiedAboutSlowHydration = false;
	$: if ($splashStore.isSlowHydration && !notifiedAboutSlowHydration) {
		notifiedAboutSlowHydration = true;
		noti.helpers.info(translations[data.language].slowHydration);
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
