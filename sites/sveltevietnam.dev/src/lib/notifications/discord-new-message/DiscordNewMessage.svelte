<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { BaseNotification, type BaseNotificationProps } from '@sveltevietnam/kit/notifications';

	import * as m from '$data/locales/generated/messages';
	import { Avatar } from '$lib/components/avatar';

	let {
		name,
		avatarURL,
		...rest
	}: BaseNotificationProps & {
		avatarURL?: string;
		name: string;
	} = $props();
</script>

<BaseNotification {...rest} title={m['notifications.discord_new_message.title']} status="info">
	{#snippet icon()}
		<Avatar class="h-6 w-6 shrink-0" src={avatarURL} alt="" {name} height="24" width="24" />
	{/snippet}
	<p><T message={m['notifications.discord_new_message.message']} {name} /></p>
</BaseNotification>
