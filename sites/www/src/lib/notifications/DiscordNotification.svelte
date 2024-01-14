<script lang="ts" context="module">
	import { SOCIAL_LINKS } from '$lib/constants';
	export const translations = {
		en: {
			message: 'is having a conversation at',
		},
		vi: {
			message: 'vừa nhắn tin tại',
		},
	};
</script>

<script lang="ts">
	import type { NotificationInstance } from '@svelte-put/noti';

	import { getLangContext } from '$lib/contexts/lang';

	import BaseNotification from './BaseNotification.svelte';

	export let notification: NotificationInstance | undefined = undefined;
	export let avatarURL: string;
	export let name: string;

	const { lang, t } = getLangContext();
</script>

<BaseNotification {notification} intent="info" on:resolve icon={false}>
	<div class="wrapper">
		<img src={avatarURL} alt="discord profile" class="c-avatar" width="28" height="28" />
		<p>
			<strong>{name}</strong>
			{translations[$lang].message}
			<a href={SOCIAL_LINKS.DISCORD} class="c-link" external>
				{$t.common.sveltevienam} Discord
			</a>.
		</p>
	</div>
</BaseNotification>

<style>
	.wrapper {
		display: flex;
		gap: 16px;
		align-items: center;
	}

	img {
		width: 28px;
		height: 28px;
	}
</style>
